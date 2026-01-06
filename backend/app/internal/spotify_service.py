import httpx
from typing import Dict, Any, List


class SpotifyService:
    """Service for interacting with Spotify Web API"""

    BASE_URL = 'https://api.spotify.com/v1'

    def __init__(self, access_token: str):
        self.access_token = access_token
        self.headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json',
        }

    async def get_user_playlists(self, limit: int = 50, offset: int = 0) -> Dict[str, Any]:
        """Get current user's playlists"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f'{self.BASE_URL}/me/playlists',
                headers=self.headers,
                params={'limit': limit, 'offset': offset},
            )

            response.raise_for_status()
            return response.json()

    async def get_all_user_playlists(self) -> List[str, Any]:
        """Get all current user's playlists"""
        all_playlists = []
        offset = 0
        limit = 50

        while True:
            data = await self.get_user_playlists(limit=limit, offset=offset)
            playlists = data.get('items', [])
            all_playlists.extend(playlists)

            if data.get('next') is None:
                break
            offset += limit

        return all_playlists

    async def get_playlist(self, playlist_id: str) -> Dict[str, Any]:
        """Get a specific playlist by ID"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f'{self.BASE_URL}/playlists/{playlist_id}',
                headers=self.headers,
            )

            response.raise_for_status()
            return response.json()

    async def get_playlist_tracks(
        self, playlist_id: str, limit: int = 100, offset: int = 0
    ) -> Dict[str, Any]:
        """Get tracks from a specific playlist"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f'{self.BASE_URL}/playlists/{playlist_id}/tracks',
                headers=self.headers,
                params={'limit': limit, 'offset': offset},
            )
            response.raise_for_status()
            return response.json()

    async def get_all_playlist_tracks(self, playlist_id: str) -> List[Dict[str, Any]]:
        """Get all tracks from a specific playlist"""
        all_tracks = []
        offset = 0
        limit = 100

        while True:
            data = await self.get_playlist_tracks(
                playlist_id=playlist_id, limit=limit, offset=offset
            )
            tracks = data.get('items', [])
            all_tracks.extend(tracks)

            if data.get('next') is None:
                break
            offset += limit

        return all_tracks

    async def get_audio_features(self, track_ids: List[str]) -> List[Dict]:
        """Get audio features for multiple tracks"""
        all_features = []

        for i in range(0, len(track_ids), 100):
            batch = track_ids[i : i + 100]
            ids_param = ','.join(batch)

            response = await self.client.get(
                'https://api.spotify.com/v1/audio-features', params={'ids': ids_param}
            )
            response.raise_for_status()
            data = response.json()
            all_features.extend(data.get('audio_features', []))

        return all_features

    async def create_playlist(self, playlist_name: str, user_id: str) -> Dict[str, Any]:
        """Create a new playlist and add tracks to it"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f'{self.BASE_URL}/users/{user_id}/playlists',
                headers=self.headers,
                json={'name': playlist_name, 'description': 'Playlist created by SSPS'},
            )
            response.raise_for_status()
            return response.json()

    async def add_tracks_to_playlist(self, playlist_id: str, track_urls: List[str]) -> None:
        """Add tracks to a playlist"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f'{self.BASE_URL}/playlists/{playlist_id}/tracks',
                headers=self.headers,
                json={'uris': track_urls},
            )
            response.raise_for_status()
            return response.json()

    async def get_artists(self, artist_ids: list[str]) -> list[dict]:
        url = 'https://api.spotify.com/v1/artists'
        params = {'ids': ','.join(artist_ids)}

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self._get_headers(), params=params)
            response.raise_for_status()
            data = response.json()
            return data.get('artists', [])

    async def remove_track_from_playlist(
        self, playlist_id: str, track_uri: str, snapshop_id: str
    ) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            payload = {'tracks': [{'uri': track_uri}], 'snapshop_id': snapshop_id}

            print(payload)

            response = await client.request(
                url=f'{self.BASE_URL}/playlists/{playlist_id}/tracks',
                method='DELETE',
                headers=self.headers,
                json=payload,
            )

            response.raise_for_status()
            return response.json()
