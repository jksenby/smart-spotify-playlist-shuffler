import { inject, Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Playlist, TrackItem } from '@app/_shared/models/spotify.model';
import { SpotifyService } from '@app/_shared/services/spotify-service';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {
  SaveToSpotify,
  ShufflePlaylist,
  ClearPlaylist,
  AddTrack,
  RemoveTrack,
  LoadCurrentPlaylist,
  ImportPlaylist,
} from './playlist.actions';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface PlaylistStateModel {
  currentPlaylist: Playlist | null;
  currentTracks: TrackItem[];
  loading: boolean;
  shuffling: boolean;
  saving: boolean;
  error: string | null;
}

@State<PlaylistStateModel>({
  name: 'playlist',
  defaults: {
    currentPlaylist: null,
    currentTracks: [],
    loading: false,
    shuffling: false,
    saving: false,
    error: null,
  },
})
@Injectable()
export class PlaylistState {
  private spotifyService = inject(SpotifyService);
  private snackBar = inject(MatSnackBar);

  @Selector()
  static getCurrentPlaylist(state: PlaylistStateModel): Playlist | null {
    return state.currentPlaylist;
  }

  @Selector()
  static getCurrentTracks(state: PlaylistStateModel): TrackItem[] {
    return state.currentTracks;
  }

  @Selector()
  static isLoading(state: PlaylistStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static isShuffling(state: PlaylistStateModel): boolean {
    return state.shuffling;
  }

  @Selector()
  static isSaving(state: PlaylistStateModel): boolean {
    return state.saving;
  }

  @Selector()
  static getError(state: PlaylistStateModel): string | null {
    return state.error;
  }

  @Selector()
  static hasPlaylist(state: PlaylistStateModel): boolean {
    return state.currentPlaylist !== null && state.currentTracks.length > 0;
  }

  @Action(ImportPlaylist)
  importPlaylist(ctx: StateContext<PlaylistStateModel>, action: ImportPlaylist) {
    ctx.patchState({ loading: true, error: null });
    return this.spotifyService.importPlaylist(action.playlistId).pipe(
      tap((response) => {
        ctx.patchState({
          currentPlaylist: response.playlist,
          currentTracks: response.tracks,
          loading: false,
        });
      }),
      catchError((error) => {
        ctx.patchState({
          loading: false,
          error: 'Failed to import playlist',
        });
        return throwError(() => error);
      }),
    );
  }

  @Action(LoadCurrentPlaylist)
  loadCurrentPlaylist(ctx: StateContext<PlaylistStateModel>) {
    ctx.patchState({ loading: true, error: null });

    return this.spotifyService.getCurrentPlaylist().pipe(
      tap((response) => {
        ctx.patchState({
          currentPlaylist: response.playlist,
          currentTracks: response.tracks,
          loading: false,
        });
      }),
      catchError((error) => {
        ctx.patchState({ loading: false });
        return throwError(() => error);
      }),
    );
  }

  @Action(ShufflePlaylist)
  shufflePlaylist(ctx: StateContext<PlaylistStateModel>, action: ShufflePlaylist) {
    const state = ctx.getState();

    if (!state.currentTracks.length || !state.currentPlaylist) {
      return;
    }

    ctx.patchState({ shuffling: true, error: null });

    return this.spotifyService.shufflePlaylist(state.currentPlaylist.id, action.algorithm).pipe(
      tap((shuffledTracks) => {
        ctx.patchState({
          currentTracks: shuffledTracks,
          shuffling: false,
        });
      }),
      catchError((error) => {
        ctx.patchState({
          shuffling: false,
          error: 'Failed to shuffle playlist',
        });
        return throwError(() => error);
      }),
    );
  }

  @Action(SaveToSpotify)
  saveToSpotify(ctx: StateContext<PlaylistStateModel>, action: SaveToSpotify) {
    const state = ctx.getState();

    if (!state.currentPlaylist || !state.currentTracks.length) {
      return;
    }

    ctx.patchState({ saving: true, error: null });

    const trackUrls = state.currentTracks.map((item) => item.track.uri);

    return this.spotifyService.createShuffledPlaylist(action.playlistName, trackUrls).pipe(
      tap(() => {
        ctx.patchState({ saving: false });
      }),
      catchError((error) => {
        ctx.patchState({
          saving: false,
          error: 'Failed to create playlist',
        });
        return throwError(() => error);
      }),
    );
  }

  @Action(ClearPlaylist)
  clearPlaylist(ctx: StateContext<PlaylistStateModel>) {
    ctx.patchState({
      currentPlaylist: null,
      currentTracks: [],
      error: null,
    });
  }

  @Action(AddTrack)
  addTrack(ctx: StateContext<PlaylistStateModel>, action: AddTrack) {
    const state = ctx.getState();
    ctx.patchState({
      currentTracks: [...state.currentTracks, action.track],
    });
  }

  @Action(RemoveTrack)
  removeTrack(ctx: StateContext<PlaylistStateModel>, action: RemoveTrack) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });
    return this.spotifyService
      .deleteTrackFromPlaylist(action.playlistId, action.trackUri, action.snapshop_id)
      .pipe(
        tap((response) => {
          ctx.patchState({
            currentTracks: state.currentTracks.filter((t) => t.track.uri !== action.trackUri),
            loading: false,
          });
          this.snackBar.open(response.message);
        }),
        catchError((error) => {
          ctx.patchState({
            saving: false,
            error: 'Failed to remove the track',
            loading: false,
          });
          return throwError(() => error);
        }),
      );
  }
}
