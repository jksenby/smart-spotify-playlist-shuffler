import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SporifyService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  getUserPlaylists() {
    return this.http.get(`${this.apiUrl}/spotify/playlists`);
  }
}
