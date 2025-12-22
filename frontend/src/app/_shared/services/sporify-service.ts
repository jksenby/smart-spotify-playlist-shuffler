import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { Observable } from 'rxjs';
import { PlaylistResponse, TracksResponse } from '../models/schemas';

@Injectable({
  providedIn: 'root',
})
export class SporifyService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  getUserPlaylists(): Observable<PlaylistResponse> {
    return this.http.get<PlaylistResponse>(`${this.apiUrl}/spotify/playlists`);
  }

  getPlaylistTracks(playlistId: string): Observable<TracksResponse> {
    return this.http.get<TracksResponse>(`${this.apiUrl}/spotify/playlists/${playlistId}/tracks`);
  }

  postPlaylist(playlistId: string) {
    return this.http.post(`${this.apiUrl}/spotify/playlists/${playlistId}/import`, {});
  }
}
