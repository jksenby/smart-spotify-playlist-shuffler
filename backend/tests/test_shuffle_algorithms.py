"""Offline regression tests: no database, credentials or Spotify requests."""
import copy
import unittest
from collections import Counter
from unittest.mock import AsyncMock

from app.internal import shuffle_algorithms as algorithms


def track(identifier, artist='Artist', year='2020', popularity=50):
    return {'track': {'id': str(identifier), 'artists': [{'id': artist, 'name': artist}],
                      'album': {'name': 'Album', 'release_date': year},
                      'popularity': popularity}}


def ids(tracks):
    return [item['track']['id'] for item in tracks]


class ShuffleTests(unittest.TestCase):
    def test_all_sync_algorithms_preserve_tracks_and_input_identity(self):
        names = ['basic_shuffle', 'balanced_artist_shuffle', 'weighted_shuffle',
                 'smart_spacing_shuffle', 'chronological_shuffle', 'reverse_playlist',
                 'reverse_by_artist', 'reverse_by_album', 'reverse_pairs', 'reverse_chunks']
        for name in names:
            for size in (0, 1, 2, 9):
                with self.subTest(algorithm=name, size=size):
                    tracks = [track(i, artist=str(i % 3)) for i in range(size)]
                    original = copy.deepcopy(tracks)
                    result = getattr(algorithms, name)(tracks)
                    self.assertIs(result, tracks)
                    self.assertEqual(Counter(ids(tracks)), Counter(ids(original)))
                    self.assertEqual(sorted(tracks, key=lambda t: t['track']['id']),
                                     sorted(original, key=lambda t: t['track']['id']))

    def test_duplicate_tracks_are_preserved(self):
        tracks = [track('a'), track('a'), track('b')]
        algorithms.weighted_shuffle(tracks)
        self.assertEqual(Counter(ids(tracks)), Counter(['a', 'a', 'b']))

    def test_weighted_shuffle_handles_zero_weights_after_positive_weights(self):
        tracks = [track('zero-a', popularity=0), track('positive', popularity=100),
                  track('zero-b', popularity=0)]
        algorithms.weighted_shuffle(tracks)
        self.assertEqual(ids(tracks)[0], 'positive')
        self.assertCountEqual(ids(tracks), ['zero-a', 'positive', 'zero-b'])

    def test_weighted_shuffle_handles_all_zero_weights(self):
        tracks = [track(i, popularity=0) for i in range(5)]
        algorithms.weighted_shuffle(tracks)
        self.assertCountEqual(ids(tracks), [str(i) for i in range(5)])

    def test_balanced_artists_appear_once_per_round(self):
        tracks = [track(f'{artist}{i}', artist=artist)
                  for artist in ['A', 'B', 'C'] for i in range(3)]
        algorithms.balanced_artist_shuffle(tracks)
        for offset in range(0, 9, 3):
            self.assertEqual({t['track']['artists'][0]['name']
                              for t in tracks[offset:offset + 3]}, {'A', 'B', 'C'})

    def test_spacing_terminates_when_all_tracks_have_same_artist(self):
        tracks = [track(i) for i in range(12)]
        algorithms.smart_spacing_shuffle(tracks)
        self.assertCountEqual(ids(tracks), [str(i) for i in range(12)])

    def test_chronological_order_and_invalid_date_fallback(self):
        for direction, expected in [('oldest_first', ['bad', 'old', 'new']),
                                    ('newest_first', ['new', 'old', 'bad'])]:
            with self.subTest(direction=direction):
                tracks = [track('new', year='2025-01-01'), track('bad', year='oops'),
                          track('old', year='2010')]
                algorithms.chronological_shuffle(tracks, direction)
                self.assertEqual(ids(tracks), expected)

    def test_reverse_pairs_keeps_unpaired_track(self):
        tracks = [track(i) for i in range(5)]
        algorithms.reverse_pairs(tracks)
        self.assertEqual(ids(tracks), ['1', '0', '3', '2', '4'])

    def test_reverse_chunks_keeps_final_short_chunk(self):
        tracks = [track(i) for i in range(5)]
        algorithms.reverse_chunks(tracks, chunk_size=3)
        self.assertEqual(ids(tracks), ['2', '1', '0', '4', '3'])

    def test_nonpositive_chunk_size_leaves_order_unchanged(self):
        for size in (0, -1):
            tracks = [track(1), track(2)]
            self.assertIs(algorithms.reverse_chunks(tracks, size), tracks)
            self.assertEqual(ids(tracks), ['1', '2'])


class SpotifyAlgorithmTests(unittest.IsolatedAsyncioTestCase):
    async def test_empty_inputs_do_not_call_spotify(self):
        service = AsyncMock()
        for name in ('mood_based_shuffle', 'tempo_based_shuffle', 'genre_based_shuffle'):
            tracks = []
            self.assertIs(await getattr(algorithms, name)(tracks, service), tracks)
        service.get_audio_features.assert_not_called()
        service.get_artists.assert_not_called()

    async def test_tempo_order_uses_mocked_features(self):
        for direction, expected in [('ascending', ['slow', 'fast']),
                                    ('descending', ['fast', 'slow'])]:
            service = AsyncMock()
            service.get_audio_features.return_value = [
                {'id': 'fast', 'tempo': 150}, {'id': 'slow', 'tempo': 80}]
            tracks = [track('fast'), track('slow')]
            self.assertIs(await algorithms.tempo_based_shuffle(tracks, service, direction), tracks)
            self.assertEqual(ids(tracks), expected)
            service.get_audio_features.assert_awaited_once_with(['fast', 'slow'])

    async def test_audio_feature_requests_are_batched(self):
        service = AsyncMock()
        service.get_audio_features.return_value = []
        tracks = [track(i) for i in range(205)]
        await algorithms.tempo_based_shuffle(tracks, service)
        self.assertEqual([len(call.args[0]) for call in
                          service.get_audio_features.await_args_list], [100, 100, 5])
        self.assertCountEqual(ids(tracks), [str(i) for i in range(205)])

    async def test_mood_order_and_missing_features(self):
        service = AsyncMock()
        service.get_audio_features.return_value = [
            {'id': 'high', 'energy': 0.9, 'valence': 0.7},
            None, {'id': 'low', 'energy': 0.1, 'valence': 0.2}]
        tracks = [track('high'), track('unknown'), track('low')]
        await algorithms.mood_based_shuffle(tracks, service)
        self.assertEqual(ids(tracks), ['low', 'unknown', 'high'])

    async def test_spotify_failure_preserves_all_tracks(self):
        for name in ('mood_based_shuffle', 'tempo_based_shuffle', 'genre_based_shuffle'):
            with self.subTest(algorithm=name):
                service = AsyncMock()
                service.get_audio_features.side_effect = RuntimeError('offline test')
                service.get_artists.side_effect = RuntimeError('offline test')
                tracks = [track('a'), track('b')]
                result = await getattr(algorithms, name)(tracks, service)
                self.assertIs(result, tracks)
                self.assertCountEqual(ids(tracks), ['a', 'b'])

    async def test_genre_shuffle_retains_unknown_genres(self):
        service = AsyncMock()
        service.get_artists.return_value = [
            {'id': 'A', 'genres': ['rock']}, {'id': 'B', 'genres': ['jazz']}, None]
        tracks = [track('a', 'A'), track('b', 'B'), track('c', 'C')]
        await algorithms.genre_based_shuffle(tracks, service)
        self.assertCountEqual(ids(tracks), ['a', 'b', 'c'])
        self.assertEqual(set(service.get_artists.await_args.args[0]), {'A', 'B', 'C'})


if __name__ == '__main__':
    unittest.main()
