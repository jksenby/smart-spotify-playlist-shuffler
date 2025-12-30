import { Component, inject, OnInit } from '@angular/core';
import { Artist, Playlist } from '@app/_shared/models/spotify.model';
import { SpotifyService } from '@app/_shared/services/spotify-service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-playlist-dialog',
  imports: [
    NgxSpinnerModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
  ],
  templateUrl: './playlist-dialog.html',
  styleUrl: './playlist-dialog.scss',
})
export class PlaylistDialog implements OnInit {
  private _spinner = inject(NgxSpinnerService);
  private _snackBar = inject(MatSnackBar);
  private _spotifyService = inject(SpotifyService);
  private _dialogRef = inject(MatDialogRef);

  public playlists$: Observable<Playlist[]> | null = null;
  public loadingTracks = new Set<string>();
  public totalPlaylists = 0;

  ngOnInit(): void {
    this._spinner.show();

    this.playlists$ = this._spotifyService.getUserPlaylists().pipe(
      tap(() => {
        this._spinner.hide();
      }),
      switchMap((response) => {
        this.totalPlaylists = response.total;
        return of(response.playlists);
      }),
      catchError((error) => {
        this._spinner.hide();
        console.error('Error fetching playlists:', error);
        this._snackBar.open('Error fetching playlists', 'Close');
        return of<Playlist[]>([]);
      }),
    );
  }

  public import(playlist: Playlist) {
    this._dialogRef.close(playlist);
  }

  public onPanelOpened(playlist: Playlist) {
    if (!playlist.tracks.items && !this.loadingTracks.has(playlist.id)) {
      this._spinner.show();
      this._spotifyService.getPlaylistTracks(playlist.id).subscribe({
        next: (response) => {
          playlist.tracks.items = response.tracks;
          this.loadingTracks.add(playlist.id);
          this._spinner.hide();
        },
        error: (err) => {
          console.error('Failed to load tracks:', err);
          this.loadingTracks.delete(playlist.id);
        },
      });
    }
  }

  public formatDuration(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  public getArtistNames(artists: Artist[]) {
    return artists.map((artist) => artist.name).join(', ');
  }
}
