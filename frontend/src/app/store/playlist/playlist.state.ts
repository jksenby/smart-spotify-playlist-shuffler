import { inject, Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Playlist, Track, TrackItem } from '@app/_shared/models/spotify.model';
import { SpotifyService } from '@app/_shared/services/sporify-service';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PlaylistActions } from './playlist.actions';

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

  @Action(PlaylistActions.ImportPlaylist)
  importPlaylist(ctx: StateContext<PlaylistStateModel>, action: PlaylistActions.ImportPlaylist) {
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

  @Action(PlaylistActions.LoadCurrentPlaylist)
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

  @Action(PlaylistActions.ShufflePlaylist)
  shufflePlaylist(ctx: StateContext<PlaylistStateModel>) {
    const state = ctx.getState();

    if (!state.currentTracks.length) {
      return;
    }

    ctx.patchState({ shuffling: true, error: null });

    return this.spotifyService.shufflePlaylist(state.currentTracks).pipe(
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

  @Action(PlaylistActions.SaveToSpotify)
  saveToSpotify(ctx: StateContext<PlaylistStateModel>, action: PlaylistActions.SaveToSpotify) {
    const state = ctx.getState();

    if (!state.currentPlaylist || !state.currentTracks.length) {
      return;
    }

    ctx.patchState({ saving: true, error: null });

    return this.spotifyService
      .createShuffledPlaylist(action.playlistName, state.currentTracks)
      .pipe(
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

  @Action(PlaylistActions.ClearPlaylist)
  clearPlaylist(ctx: StateContext<PlaylistStateModel>) {
    ctx.patchState({
      currentPlaylist: null,
      currentTracks: [],
      error: null,
    });
  }

  @Action(PlaylistActions.AddTrack)
  addTrack(ctx: StateContext<PlaylistStateModel>, action: PlaylistActions.AddTrack) {
    const state = ctx.getState();
    ctx.patchState({
      currentTracks: [...state.currentTracks, action.track],
    });
  }

  @Action(PlaylistActions.RemoveTrack)
  removeTrack(ctx: StateContext<PlaylistStateModel>, action: PlaylistActions.RemoveTrack) {
    const state = ctx.getState();
    ctx.patchState({
      currentTracks: state.currentTracks.filter((t) => t.track.id !== action.trackId),
    });
  }
}
