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
}
