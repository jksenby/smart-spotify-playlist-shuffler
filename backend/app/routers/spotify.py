from fastapi import APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from fastapi import Depends
import time

from app.models.user import User
from app.routers.auth import get_current_user, refresh_spotify_token
from app.internal.spotify_service import SpotifyService
from app.db.session import get_db
from app.internal.shuffle_algorithms import (
    balanced_artist_shuffle,
    basic_shuffle,
    chronological_shuffle,
    genre_based_shuffle,
    mood_based_shuffle,
    reverse_by_album,
    reverse_by_artist,
    reverse_chunks,
    reverse_pairs,
    reverse_playlist,
    smart_spacing_shuffle,
    tempo_based_shuffle,
    weighted_shuffle,
)
from app.schemas.spotify import CreatePlaylisRequest, ShuffleRequest

router = APIRouter(prefix='/spotify', tags=['spotify'])


async def get_spotify_service(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> SpotifyService:
    """Dependency to create a SpotifyService instance with the current user"""
    if not current_user.spotify_access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='No Spotify access token found. Please re-authenticate',
        )
    current_time = int(time.time())
    if (
        current_user.spotify_token_expires_at
        and current_user.spotify_token_expires_at <= current_time + 300
    ):
        try:
            access_token = await refresh_spotify_token(current_user, db)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f'Failed to refresh token: {str(e)}',
            )
    else:
        access_token = current_user.spotify_access_token

    return SpotifyService(access_token=access_token)


@router.get('/playlists')
async def get_user_playlists(
    spotify_service: SpotifyService = Depends(get_spotify_service),
):
    """Get all playlists for the authenticated user"""
    try:
        playlists = await spotify_service.get_all_user_playlists()
        return {'playlists': playlists, 'total': len(playlists)}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f'Failed to fetch playlists: {str(e)}',
        )


@router.get('/playlists/current')
async def get_user_current_playlist(
    spotify_service: SpotifyService = Depends(get_spotify_service),
    current_user: User = Depends(get_current_user),
):
    """Get user's current playlist"""
    try:
        if not current_user.current_playlist_id:
            return {'message': 'No current playlist found', 'playlist': None}
        playlist = await spotify_service.get_playlist(current_user.current_playlist_id)
        tracks = await spotify_service.get_all_playlist_tracks(current_user.current_playlist_id)

        return {
            'message': 'Current playlist found',
            'playlist': playlist,
            'tracks': tracks,
            'tracks_count': len(tracks),
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'Playlist not found: {str(e)}',
        )


@router.post('/playlists/shuffle')
async def shuffle_playlist(
    request: ShuffleRequest,
    spotify_service: SpotifyService = Depends(get_spotify_service),
):
    """Shuffle the tracks in a playlist"""
    try:
        tracks = await spotify_service.get_all_playlist_tracks(request.playlist_id)

        if request.shuffle_algorithm == 'basic_shuffle':
            basic_shuffle(tracks)
        elif request.shuffle_algorithm == 'balanced_artist':
            balanced_artist_shuffle(tracks)
        elif request.shuffle_algorithm == 'mood_based':
            await mood_based_shuffle(tracks, spotify_service)
        elif request.shuffle_algorithm == 'smart_spacing':
            smart_spacing_shuffle(tracks, min_gap=3)
        elif request.shuffle_algorithm == 'weighted':
            weighted_shuffle(tracks)
        elif request.shuffle_algorithm == 'genre_based':
            await genre_based_shuffle(tracks, spotify_service)
        elif request.shuffle_algorithm == 'tempo_ascending':
            await tempo_based_shuffle(tracks, spotify_service, direction='ascending')
        elif request.shuffle_algorithm == 'tempo_descending':
            await tempo_based_shuffle(tracks, spotify_service, direction='descending')
        elif request.shuffle_algorithm == 'tempo_wave':
            await tempo_based_shuffle(tracks, spotify_service, direction='wave')
        elif request.shuffle_algorithm == 'tempo_blocks':
            await tempo_based_shuffle(tracks, spotify_service, direction='random_blocks')
        elif request.shuffle_algorithm == 'chronological_newest':
            chronological_shuffle(tracks, direction='newest_first')
        elif request.shuffle_algorithm == 'chronological_oldest':
            chronological_shuffle(tracks, direction='oldest_first')
        elif request.shuffle_algorithm == 'chronological_decades':
            chronological_shuffle(tracks, direction='decades')
        elif request.shuffle_algorithm == 'chronological_mixed':
            chronological_shuffle(tracks, direction='mixed_eras')
        elif request.shuffle_algorithm == 'reverse_playlist':
            reverse_playlist(tracks)
        elif request.shuffle_algorithm == 'reverse_by_artist':
            reverse_by_artist(tracks)
        elif request.shuffle_algorithm == 'reverse_by_album':
            reverse_by_album(tracks)
        elif request.shuffle_algorithm == 'reverse_pairs':
            reverse_pairs(tracks)
        elif request.shuffle_algorithm == 'reverse_chunks':
            reverse_chunks(tracks, chunk_size=5)
        return tracks
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Failed to shuffle playlist: {str(e)}')


@router.post('/playlists/create')
async def create_playlist(
    request: CreatePlaylisRequest,
    spotify_service: SpotifyService = Depends(get_spotify_service),
    current_user: User = Depends(get_current_user),
):
    """Shuffle the tracks in a playlist"""
    try:
        playlist = await spotify_service.create_playlist(
            request.playlist_name, current_user.spotify_id
        )
        await spotify_service.add_tracks_to_playlist(playlist['id'], request.tracks_urls)
        return playlist
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Failed to shuffle playlist: {str(e)}')


@router.get('/playlists/{playlist_id}')
async def get_playlist_details(
    playlist_id: str, spotify_service: SpotifyService = Depends(get_spotify_service)
):
    """Get detailed information about a specific playlist"""
    try:
        playlist = await spotify_service.get_playlist(playlist_id)
        return playlist
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'Playlist not found: {str(e)}',
        )


@router.get('/playlists/{playlist_id}/tracks')
async def get_playlist_tracks(
    playlist_id: str, spotify_service: SpotifyService = Depends(get_spotify_service)
):
    """Get tracks from a specific playlist"""
    try:
        tracks = await spotify_service.get_all_playlist_tracks(playlist_id)
        return {'tracks': tracks, 'total': len(tracks)}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f'Failed to fetch playlist tracks: {str(e)}',
        )


@router.post('/playlists/{playlist_id}/import')
async def import_playlist(
    playlist_id: str,
    spotify_service: SpotifyService = Depends(get_spotify_service),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Import a playlist and its tracks to the database"""
    try:
        playlist = await spotify_service.get_playlist(playlist_id)
        tracks = await spotify_service.get_all_playlist_tracks(playlist_id)

        current_user.current_playlist_id = playlist_id
        db.commit()

        return {
            'message': 'Playlist imported successfully',
            'playlist': playlist,
            'tracks': tracks,
            'tracks_count': len(tracks),
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f'Failed to import playlist: {str(e)}',
        )


@router.delete('/playlists/{playlist_id}/tracks/{track_uri}')
async def removeTrackFromPlaylist(
    playlist_id: str,
    track_uri: str,
    snapshop_id: str,
    spotify_service: SpotifyService = Depends(get_spotify_service),
):
    """Remove Track From Playlist"""
    try:
        await spotify_service.remove_track_from_playlist(
            playlist_id=playlist_id, track_uri=track_uri, snapshop_id=snapshop_id
        )

        return {'message': 'Track removed from playlist'}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f'Failed to remove track: {str(e)}',
        )
