import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { ImportResponse, PlaylistResponse, TracksResponse } from '../models/schemas';
import { Playlist, TrackItem } from '../models/spotify.model';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private http = inject(HttpClient);
  private apiUrl = environment.API_URL;

  getUserPlaylists(): Observable<PlaylistResponse> {
    return this.http.get<PlaylistResponse>(`${this.apiUrl}/spotify/playlists`);
  }

  getPlaylistTracks(playlistId: string): Observable<TracksResponse> {
    return this.http.get<TracksResponse>(`${this.apiUrl}/spotify/playlists/${playlistId}/tracks`);
  }

  importPlaylist(playlistId: string): Observable<ImportResponse> {
    return this.http.post<ImportResponse>(
      `${this.apiUrl}/spotify/playlists/${playlistId}/import`,
      {},
    );
  }

  shufflePlaylist(playlist_id: string, shuffle_algorithm: string): Observable<TrackItem[]> {
    return this.http.post<TrackItem[]>(`${this.apiUrl}/spotify/playlists/shuffle`, {
      playlist_id,
      shuffle_algorithm,
    });
  }

  createShuffledPlaylist(playlist_name: string, tracks_urls: string[]): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.apiUrl}/spotify/playlists/create`, {
      playlist_name,
      tracks_urls,
    });
  }

  getCurrentPlaylist(): Observable<{ playlist: Playlist | null; tracks: TrackItem[] }> {
    return this.http.get<{ playlist: Playlist | null; tracks: TrackItem[] }>(
      `${this.apiUrl}/spotify/playlists/current`,
    );
  }
}
