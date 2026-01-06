from ast import List
import random
from typing import Any, Dict
from collections import defaultdict


def basic_shuffle(tracks: Dict[str, any]):
    """Basic shuffle algorithm"""
    random.shuffle(tracks)
    return tracks


def balanced_artist_shuffle(tracks: List[Dict[str, any]]):
    if not tracks:
        return tracks

    artist_groups = {}
    for track in tracks:
        artist = track['track']['artists'][0]['name']
        if artist not in artist_groups:
            artist_groups[artist] = []
        artist_groups[artist].append(track)

    for artist_tracks in artist_groups.values():
        random.shuffle(artist_tracks)

    result = []
    artist_queues = list(artist_groups.values())

    while artist_queues:
        random.shuffle(artist_queues)
        for queue in artist_queues[:]:
            if queue:
                result.append(queue.pop(0))
            if not queue:
                artist_queues.remove(queue)

    tracks[:] = result
    return tracks


async def mood_based_shuffle(tracks: List[Dict[str, Any]], spotify_service):
    """Shuffle based on audio features for smooth transitions"""
    if not tracks:
        return tracks

    track_ids = [
        track['track']['id'] for track in tracks if track.get('track') and track['track'].get('id')
    ]

    if not track_ids:
        random.shuffle(tracks)
        return tracks

    all_audio_features = []
    for i in range(0, len(track_ids), 100):
        batch_ids = track_ids[i : i + 100]
        try:
            audio_features = await spotify_service.get_audio_features(batch_ids)
            all_audio_features.extend(audio_features)
        except Exception as e:
            print(f'Error fetching audio features: {e}')
            pass

    features_map = {}
    for features in all_audio_features:
        if features:
            features_map[features['id']] = features

    track_feature_pairs = []
    for track in tracks:
        track_id = track['track']['id']
        if track_id in features_map:
            features = features_map[track_id]
            track_feature_pairs.append((track, features['energy'], features['valence']))
        else:
            track_feature_pairs.append((track, 0.5, 0.5))

    track_feature_pairs.sort(key=lambda x: (x[1], x[2]))

    tracks[:] = [pair[0] for pair in track_feature_pairs]
    return tracks


def weighted_shuffle(tracks: List[Dict[str, any]], weight_key='popularity'):
    if not tracks:
        return tracks

    weights = [track['track'].get(weight_key, 50) for track in tracks]

    total_weight = sum(weights)
    if total_weight > 0:
        probabilities = [w / total_weight for w in weights]
    else:
        probabilities = [1 / len(tracks)] * len(tracks)

    indices = list(range(len(tracks)))
    shuffled_indices = []

    while indices:
        chosen_idx = random.choices(indices, weights=[probabilities[i] for i in indices])[0]
        shuffled_indices.append(chosen_idx)
        indices.remove(chosen_idx)

    tracks[:] = [tracks[i] for i in shuffled_indices]
    return tracks


def smart_spacing_shuffle(tracks: List[Dict[str, any]], min_gap=3):
    if len(tracks) <= min_gap:
        random.shuffle(tracks)
        return tracks

    result = []
    remaining = tracks.copy()
    random.shuffle(remaining)

    max_attempts_per_round = len(remaining) * 2
    consecutive_failures = 0

    while remaining:
        placed = False
        attempts = 0

        for i in range(len(remaining)):
            track = remaining[i]
            artist = track['track']['artists'][0]['name']

            recent_artists = [t['track']['artists'][0]['name'] for t in result[-min_gap:]]

            if artist not in recent_artists:
                result.append(track)
                remaining.pop(i)
                placed = True
                consecutive_failures = 0
                break

            attempts += 1
            if attempts >= max_attempts_per_round:
                break

        if not placed and remaining:
            consecutive_failures += 1

            if consecutive_failures > 3:
                result.append(remaining.pop(0))
                consecutive_failures = 0
            else:
                for i in range(len(remaining)):
                    track = remaining[i]
                    artist = track['track']['artists'][0]['name']

                    reduced_gap = max(1, min_gap - consecutive_failures)
                    recent_artists = [
                        t['track']['artists'][0]['name'] for t in result[-reduced_gap:]
                    ]

                    if artist not in recent_artists or len(remaining) == 1:
                        result.append(track)
                        remaining.pop(i)
                        break

    tracks[:] = result
    return tracks


async def genre_based_shuffle(tracks: List[Dict[str, Any]], spotify_service):
    if not tracks:
        return tracks

    artist_ids = list(
        set(
            track['track']['artists'][0]['id']
            for track in tracks
            if track.get('track') and track['track'].get('artists')
        )
    )

    if not artist_ids:
        random.shuffle(tracks)
        return tracks

    artist_genres_map = {}
    for i in range(0, len(artist_ids), 50):
        batch_ids = artist_ids[i : i + 50]
        try:
            artists_info = await spotify_service.get_artists(batch_ids)
            for artist in artists_info:
                if artist and artist.get('genres'):
                    artist_genres_map[artist['id']] = artist['genres']
        except Exception as e:
            print(f'Error fetching artist genres: {e}')

    genre_groups = defaultdict(list)
    no_genre_tracks = []

    for track in tracks:
        artist_id = track['track']['artists'][0]['id']
        if artist_id in artist_genres_map and artist_genres_map[artist_id]:
            primary_genre = artist_genres_map[artist_id][0]
            genre_groups[primary_genre].append(track)
        else:
            no_genre_tracks.append(track)

    for genre_tracks in genre_groups.values():
        random.shuffle(genre_tracks)

    random.shuffle(no_genre_tracks)

    result = []
    genre_queues = list(genre_groups.values())

    while genre_queues or no_genre_tracks:
        random.shuffle(genre_queues)
        for queue in genre_queues[:]:
            if queue:
                result.append(queue.pop(0))
            if not queue:
                genre_queues.remove(queue)

        if no_genre_tracks and (not genre_queues or len(result) % 5 == 0):
            result.append(no_genre_tracks.pop(0))

    tracks[:] = result
    return tracks


async def tempo_based_shuffle(tracks: List[Dict[str, Any]], spotify_service, direction='ascending'):
    if not tracks:
        return tracks

    track_ids = [
        track['track']['id'] for track in tracks if track.get('track') and track['track'].get('id')
    ]

    if not track_ids:
        random.shuffle(tracks)
        return tracks

    all_audio_features = []
    for i in range(0, len(track_ids), 100):
        batch_ids = track_ids[i : i + 100]
        try:
            audio_features = await spotify_service.get_audio_features(batch_ids)
            all_audio_features.extend(audio_features)
        except Exception as e:
            print(f'Error fetching audio features: {e}')

    features_map = {}
    for features in all_audio_features:
        if features:
            features_map[features['id']] = features

    track_tempo_pairs = []
    for track in tracks:
        track_id = track['track']['id']
        if track_id in features_map:
            tempo = features_map[track_id].get('tempo', 120)
            track_tempo_pairs.append((track, tempo))
        else:
            track_tempo_pairs.append((track, 120))

    if direction == 'ascending':
        track_tempo_pairs.sort(key=lambda x: x[1])
    elif direction == 'descending':
        track_tempo_pairs.sort(key=lambda x: x[1], reverse=True)
    elif direction == 'wave':
        track_tempo_pairs.sort(key=lambda x: x[1])
        wave_result = []
        low_tempo = track_tempo_pairs[: len(track_tempo_pairs) // 2]
        high_tempo = track_tempo_pairs[len(track_tempo_pairs) // 2 :]

        for i in range(max(len(low_tempo), len(high_tempo))):
            if i < len(low_tempo):
                wave_result.append(low_tempo[i])
            if i < len(high_tempo):
                wave_result.append(high_tempo[i])

        track_tempo_pairs = wave_result
    elif direction == 'random_blocks':
        track_tempo_pairs.sort(key=lambda x: x[1])
        block_size = len(track_tempo_pairs) // 4 or 1
        blocks = [
            track_tempo_pairs[i : i + block_size]
            for i in range(0, len(track_tempo_pairs), block_size)
        ]
        for block in blocks:
            random.shuffle(block)
        track_tempo_pairs = [track for block in blocks for track in block]

    tracks[:] = [pair[0] for pair in track_tempo_pairs]
    return tracks


def chronological_shuffle(tracks: List[Dict[str, Any]], direction='newest_first'):
    if not tracks:
        return tracks

    track_date_pairs = []
    for track in tracks:
        release_date = track['track'].get('album', {}).get('release_date', '')

        try:
            if len(release_date) >= 4:
                year = int(release_date[:4])
            else:
                year = 2000
        except (ValueError, TypeError):
            year = 2000

        track_date_pairs.append((track, year))

    if direction == 'newest_first':
        track_date_pairs.sort(key=lambda x: x[1], reverse=True)
    elif direction == 'oldest_first':
        track_date_pairs.sort(key=lambda x: x[1])
    elif direction == 'decades':
        decade_groups = defaultdict(list)
        for track, year in track_date_pairs:
            decade = (year // 10) * 10
            decade_groups[decade].append(track)

        for decade_tracks in decade_groups.values():
            random.shuffle(decade_tracks)

        result = []
        for decade in sorted(decade_groups.keys(), reverse=True):
            result.extend(decade_groups[decade])

        tracks[:] = result
        return tracks
    elif direction == 'mixed_eras':
        track_date_pairs.sort(key=lambda x: x[1])
        old_tracks = track_date_pairs[: len(track_date_pairs) // 2]
        new_tracks = track_date_pairs[len(track_date_pairs) // 2 :]

        result = []
        for i in range(max(len(old_tracks), len(new_tracks))):
            if i < len(new_tracks):
                result.append(new_tracks[-(i + 1)])
            if i < len(old_tracks):
                result.append(old_tracks[i])

        tracks[:] = [pair[0] for pair in result]
        return tracks

    tracks[:] = [pair[0] for pair in track_date_pairs]
    return tracks


def reverse_playlist(tracks: List[Dict[str, any]]):
    if not tracks:
        return tracks

    tracks.reverse()
    return tracks


def reverse_by_artist(tracks: List[Dict[str, any]]):
    if not tracks:
        return tracks

    artist_groups = {}
    artist_order = []

    for track in tracks:
        artist = track['track']['artists'][0]['name']
        if artist not in artist_groups:
            artist_groups[artist] = []
            artist_order.append(artist)
        artist_groups[artist].append(track)

    for artist_tracks in artist_groups.values():
        artist_tracks.reverse()

    result = []
    for artist in artist_order:
        result.extend(artist_groups[artist])

    tracks[:] = result
    return tracks


def reverse_by_album(tracks: List[Dict[str, any]]):
    if not tracks:
        return tracks

    album_groups = {}
    album_order = []

    for track in tracks:
        album = track['track']['album']['name']
        if album not in album_groups:
            album_groups[album] = []
            album_order.append(album)
        album_groups[album].append(track)

    for album_tracks in album_groups.values():
        album_tracks.reverse()

    result = []
    for album in album_order:
        result.extend(album_groups[album])

    tracks[:] = result
    return tracks


def reverse_pairs(tracks: List[Dict[str, any]]):
    if not tracks:
        return tracks

    result = []
    for i in range(0, len(tracks), 2):
        if i + 1 < len(tracks):
            result.append(tracks[i + 1])
            result.append(tracks[i])
        else:
            result.append(tracks[i])

    tracks[:] = result
    return tracks


def reverse_chunks(tracks: List[Dict[str, any]], chunk_size: int = 5):
    if not tracks or chunk_size <= 0:
        return tracks

    result = []
    for i in range(0, len(tracks), chunk_size):
        chunk = tracks[i : i + chunk_size]
        chunk.reverse()
        result.extend(chunk)

    tracks[:] = result
    return tracks
