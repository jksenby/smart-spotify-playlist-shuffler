import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { Observable } from 'rxjs';
import { ImportResponse, PlaylistResponse, TracksResponse } from '../models/schemas';
import { Playlist, Track, TrackItem } from '../models/spotify.model';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

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

  shufflePlaylist(tracks: TrackItem[]): Observable<TrackItem[]> {
    return this.http.post<TrackItem[]>(`${this.apiUrl}/spotify/playlists/shuffle`, { tracks });
  }

  createShuffledPlaylist(playlistName: string, tracks: TrackItem[]): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.apiUrl}/spotify/playlists/create`, {
      name: playlistName,
      tracks,
    });
  }

  getCurrentPlaylist(): Observable<{ playlist: Playlist | null; tracks: TrackItem[] }> {
    return this.http.get<{ playlist: Playlist | null; tracks: TrackItem[] }>(
      `${this.apiUrl}/spotify/playlists/current`,
    );
  }
}
