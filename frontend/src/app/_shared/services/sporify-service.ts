import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { Observable } from 'rxjs';
import { Playlist, Track } from '../models/spotify.model';

@Injectable({
  providedIn: 'root',
})
export class SporifyService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  getUserPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.apiUrl}/spotify/playlists`);
  }

  getPlaylistTracks(playlistId: string): Observable<Track[]> {
    return this.http.get<Track[]>(`${this.apiUrl}/spotify/playlists/${playlistId}/tracks`);
  }

  postPlaylist(playlistId: string) {
    return this.http.post(`${this.apiUrl}/spotify/playlists/${playlistId}/import`, {});
  }
}
