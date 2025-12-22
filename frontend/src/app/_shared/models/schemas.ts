import { Playlist, TrackItem } from "./spotify.model";

export interface PlaylistResponse {
    playlists: Playlist[];
    total: number;
}

export interface TracksResponse {
    tracks: TrackItem[];
    total: number;
}