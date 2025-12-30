from ast import List
import random
from typing import Any, Dict


def basic_shuffle(tracks: Dict[str, any]):
    """Basic shuffle algorithm"""
    random.shuffle(tracks)
    return tracks


def balanced_artist_shuffle(tracks: List[Dict[str, any]]):
    """Shuffle with balanced artist distribution"""
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
    return track


def weighted_shuffle(tracks: List[Dict[str, any]], weight_key='popularity'):
    """Shuffle with weighted probability based on track popularity"""
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
    """Shuffle with minimum spacing between tracks from same artist"""
    if len(tracks) <= min_gap:
        random.shuffle(tracks)
        return tracks

    result = []
    remaining = tracks.copy()
    random.shuffle(remaining)

    while remaining:
        for i, track in enumerate(remaining):
            artist = track['track']['artists'][0]['name']

            recent_artists = [t['track']['artists'][0]['name'] for t in result[-min_gap:]]

            if artist not in recent_artists or len(remaining) == 1:
                result.append(track)
                remaining.pop(i)
                break

    tracks[:] = result
    return tracks
