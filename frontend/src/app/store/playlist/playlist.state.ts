import { Injectable } from '@angular/core';
import { PlaylistModel } from '@app/_shared/models/playlist..model';
import { State } from '@ngxs/store';

@State<PlaylistModel>({
  name: 'playlist',
  defaults: {
    title: '',
    artist: '',
  },
})
@Injectable()
export class PlaylistState {}
