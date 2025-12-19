import { Component, inject, OnInit } from '@angular/core';
import { Playlist } from '@app/_shared/models/spotify.model';
import { SporifyService } from '@app/_shared/services/sporify-service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, of, tap } from 'rxjs';
import { CommonModule } from "@angular/common";
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-playlist-dialog',
  imports: [NgxSpinnerModule, CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './playlist-dialog.html',
  styleUrl: './playlist-dialog.scss',
})
export class PlaylistDialog implements OnInit {
  private _spinner = inject(NgxSpinnerService)
  private _snackBar = inject(MatSnackBar)
  private _spotifyService = inject(SporifyService);

  public playlists$: Observable<Playlist[]> | null = null;

  ngOnInit(): void {
    this._spinner.show();

    this.playlists$ = this._spotifyService.getUserPlaylists().pipe(
      tap(() => {
        this._spinner.hide();
      }),
      catchError((error) => {
        this._spinner.hide();
        console.error('Error fetching playlists:', error);
        this._snackBar.open('Error fetching playlists', 'Close');
        return of([]);
      }),
    );
  }
}
