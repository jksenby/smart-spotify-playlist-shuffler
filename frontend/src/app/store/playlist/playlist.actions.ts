import { Track } from '@app/_shared/models/spotify.model';

export namespace Playlist {
  export class Load {
    static readonly type = '[Playlist] Load Tracks';
  }
  export class Add {
    static readonly type = '[Playlist] Add Track';
    constructor(public payload: { title: string; artist: string }) {}
  }
  export class Shuffle {
    static readonly type = '[Playlist] Shuffle';
  }

  export class ImportFromSpotify {
    static readonly type = '[Playlist] Import from Spotify';
    constructor(public playlistId: string) {}
  }
  export class ImportFromFile {
    static readonly type = '[Playlist] Import from File';
    constructor(public tracks: Track[]) {}
  }
}
