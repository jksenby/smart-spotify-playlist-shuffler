from fastapi import APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from fastapi import Depends
import time

from app.models.user import User
from app.routers.auth import get_current_user, refresh_spotify_token
from app.internal.spotify_service import SpotifyService
from app.db.session import get_db

router = APIRouter(prefix="/spotify", tags=["spotify"])

async def get_spotify_service(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> SpotifyService:
    """Dependency to create a SpotifyService instance with the current user"""
    if not current_user.spotify_access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="No Spotify access token found. Please re-authenticate"
        )
    current_time = int(time.time())
    if current_user.spotify_token_expires_at and current_user.spotify_token_expires_at <= current_time + 300:
        try:
            access_token = await refresh_spotify_token(current_user, db)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Failed to refresh token: {str(e)}"
            )
    else:
        access_token = current_user.spotify_access_token
    
    return SpotifyService(access_token=access_token)

@router.get('/playlists')
async def get_user_playlists(spotify_service: SpotifyService = Depends(get_spotify_service)):
    """Get all playlists for the authenticated user"""
    try:
        playlists = await spotify_service.get_all_user_playlists()
        return {"playlists": playlists, "total": len(playlists)}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to fetch playlists: {str(e)}"
        )

@router.get("/playlists/{playlist_id}")
async def get_playlist_details(
    playlist_id: str, 
    spotify_service: SpotifyService = Depends(get_spotify_service)
):
    """Get detailed information about a specific playlist"""
    try:
        playlist = await spotify_service.get_playlist(playlist_id)
        return playlist
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Playlist not found: {str(e)}"
        )

@router.get("/playlists/{playlist_id}/tracks")
async def get_playlist_tracks(
    playlist_id: str, 
    spotify_service: SpotifyService = Depends(get_spotify_service)
):
    """Get tracks from a specific playlist"""
    try:
        tracks = await spotify_service.get_all_playlist_tracks(playlist_id)
        return {"tracks": tracks, "total": len(tracks)}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to fetch playlist tracks: {str(e)}"
        )

@router.post("/playlists/{playlist_id}/import")
async def import_playlist(
    playlist_id: str,
    spotify_service: SpotifyService = Depends(get_spotify_service),
):
    """Import a playlist and its tracks to the database"""
    try:
        playlist = await spotify_service.get_playlist(playlist_id)
        tracks = await spotify_service.get_all_playlist_tracks(playlist_id)

        return {
            "message": "Playlist imported successfully",
            "playlist": {
                "id": playlist.get("id"),
                "name": playlist.get("name"),
                "description": playlist.get("description"),
                "total_tracks": len(tracks)
            },
            "tracks_count": len(tracks)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to import playlist: {str(e)}"
        )
