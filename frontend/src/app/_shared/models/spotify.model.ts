export interface Track {
  album: Album;
  album_type: string;
  artists: Array<Artist>;
  available_markets: Array<Market>;
  external_urls: ExternalURLs;
  href: string;
  id: string;
  images: Array<ImageObject>;
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
  duration_ms: number;
  limit?: number;
  offset?: number;
  next?: string;
  previous?: string;
  total?: number;
}

export interface Album {
  album_type: string;
  total_tracks: number;
  available_markets: Array<string>;
  external_urls: ExternalURLs;
  href: string;
  id: string;
  images: Array<ImageObject>;
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions: Restriction;
  type: string;
  uri: string;
  artists: Array<Artist>;
  tracks: Array<Track>;
  copyrights: Array<Copyright>;
  external_ids: ExternalIDs;
  genres: Array<string>;
  label: string;
  popularity: number;
}

export interface Artist {
  external_urls: ExternalURLs;
  followers: Followers;
  genres: Array<string>;
  href: string;
  id: string;
  images: Array<ImageObject>;
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface User {
  country: string;
  display_name: string;
  email: string;
  explicit_content: ExplicitContent;
  external_urls: ExternalURLs;
  followers: Followers;
  href: string;
  id: string;
  images: Array<ImageObject>;
  product: string;
  type: string;
  uri: string;
}

export interface Playlist {
  collaborative: boolean;
  description: string;
  external_urls: ExternalURLs;
  href: string;
  id: string;
  images: Array<ImageObject>;
  name: string;
  owner: User;
  public: boolean;
  snapshot_id: string;
  tracks: PlaylistTracks;
  type: string;
  uri: string;
}

export interface TrackItem {
  added_at: string;
  added_by: {
    external_urls: ExternalURLs;
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  is_local: boolean;
  track: Track;
}

export enum Market {
  ca = 'CA',
  br = 'BR',
  it = 'IT',
}

export interface ImageObject {
  height: number;
  url: string;
  width: number;
}

export interface ExternalURLs {
  spotify: string;
}

export interface ExternalIDs {
  isrc: string;
  ean: string;
  upc: string;
}

export interface Followers {
  href: string;
  total: number;
}

export interface ExplicitContent {
  filter_enabled: boolean;
  filter_locked: boolean;
}

export interface Copyright {
  text: string;
  type: string;
}

export interface Restriction {
  reason: string;
}

export interface PlaylistTracks {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: Array<TrackItem>;
}
