import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { filter, first, Observable, Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthActions } from '@app/store/auth/auth.actions';
import { AuthState } from '@app/store/auth/auth.state';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Artist, Playlist, Track, TrackItem, User } from '@app/_shared/models/spotify.model';
import { PlaylistDialog } from '@app/features/dialogs/playlist-dialog/playlist-dialog';
import { PlaylistState } from '@app/store/playlist/playlist.state';
import { PlaylistActions } from '@app/store/playlist/playlist.actions';

@Component({
  selector: 'app-main-page',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    NgxSpinnerModule,
    FormsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private spinner = inject(NgxSpinnerService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  public user$: Observable<User | null> = this.store.select(AuthState.getUser);
  public isAuthenticated$: Observable<boolean> = this.store.select(AuthState.isAuthenticated);
  public loading$: Observable<boolean> = this.store.select(AuthState.isLoading);

  public currentPlaylist$: Observable<Playlist | null> = this.store.select(
    PlaylistState.getCurrentPlaylist,
  );
  public currentTracks$: Observable<TrackItem[]> = this.store.select(
    PlaylistState.getCurrentTracks,
  );
  public playlistLoading$: Observable<boolean> = this.store.select(PlaylistState.isLoading);
  public shuffling$: Observable<boolean> = this.store.select(PlaylistState.isShuffling);
  public saving$: Observable<boolean> = this.store.select(PlaylistState.isSaving);
  public hasPlaylist$: Observable<boolean> = this.store.select(PlaylistState.hasPlaylist);

  private readonly _destroyed$ = new Subject<void>();

  public newArtist: string = '';
  public newTitle: string = '';

  public onAdd() {}

  public onShuffle() {
    this.store.dispatch(new PlaylistActions.ShufflePlaylist()).subscribe({
      next: () => {
        this.snackBar.open('Playlist shuffled!', 'Close');
      },
      error: () => {
        this.snackBar.open('Something went wrong', 'Close');
      },
    });
  }

  public onSaveToSpotify() {
    let playlistName: string = '';

    this.currentPlaylist$.pipe(takeUntil(this._destroyed$)).subscribe((playlist) => {
      if (playlist) {
        playlistName = playlist.name + ' (Shuffled)';
      }
    });

    if (!playlistName) return;

    this.store.dispatch(new PlaylistActions.SaveToSpotify(playlistName)).subscribe({
      next: () => {
        this.snackBar.open(`Playlist ${playlistName} saved to Spotify!`, 'Close');
      },
      error: () => {
        this.snackBar.open('Something went wrong', 'Close');
      },
    });
  }

  public onUploadPlaylist() {
    this.dialog
      .open(PlaylistDialog, {
        minWidth: '70vw',
        minHeight: '75vh',
      })
      .afterClosed()
      .pipe(
        first(),
        filter((d) => !!d),
      )
      .subscribe((response: Playlist) => {
        console.log(response);

        this.store.dispatch(new PlaylistActions.ImportPlaylist(response.id)).subscribe({
          next: () => {
            this.snackBar.open(`${response.name} uploaded!`, 'Close');
          },
          error: () => {
            this.snackBar.open('Something went wrong', 'Close');
          },
        });
      });
  }

  public onLogin() {
    this.store.dispatch(new AuthActions.Login());
  }

  public onLogout() {
    this.store.dispatch(new AuthActions.Logout());
    this.store.dispatch(new PlaylistActions.ClearPlaylist());
  }

  ngOnInit(): void {
    this.store.dispatch(new AuthActions.GetCurrentUser());

    this.loading$.pipe(takeUntil(this._destroyed$)).subscribe((isLoading) => {
      if (isLoading) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    });

    this.isAuthenticated$
      .pipe(takeUntil(this._destroyed$))
      .pipe(
        filter((isAuthenticated) => isAuthenticated),
        first(),
      )
      .subscribe(() => {
        this.store.dispatch(new PlaylistActions.LoadCurrentPlaylist());
      });
  }

  public formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  public getArtistNames(artists: Artist[]) {
    return artists.map((artist) => artist.name).join(', ');
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
