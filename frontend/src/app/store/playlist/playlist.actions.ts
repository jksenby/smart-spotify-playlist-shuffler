import { TrackItem } from '@app/_shared/models/spotify.model';

export class ImportPlaylist {
  static readonly type = '[Playlist] Import Playlist';
  constructor(public playlistId: string) {}
}

export class LoadCurrentPlaylist {
  static readonly type = '[Playlist] Load Current Playlist';
}

export class ShufflePlaylist {
  static readonly type = '[Playlist] Shuffle Playlist';
  constructor(public algorithm: string) {}
}

export class SaveToSpotify {
  static readonly type = '[Playlist] Save To Spotify';
  constructor(public playlistName: string) {}
}

export class ClearPlaylist {
  static readonly type = '[Playlist] Clear Playlist';
}

export class AddTrack {
  static readonly type = '[Playlist] Add Track';
  constructor(public track: TrackItem) {}
}

export class RemoveTrack {
  static readonly type = '[Playlist] Remove Track';
  constructor(
    public trackUri: string,
    public playlistId: string,
    public snapshop_id: string,
  ) {}
}
