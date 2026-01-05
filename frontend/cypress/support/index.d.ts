/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    loginSpotify(token?: string): Chainable<void>;
    mockSpotifyApi(): Chainable<void>;
    getByDataCy(value: string): Chainable<JQuery<HTMLElement>>;
    dataCy(value: string): Chainable<JQuery<HTMLElement>>;
    waitForAngular(): Chainable<void>;
    shouldBeInteractive(): Chainable<Subject>;
    typeRealistic(text: string, delay?: number): Chainable<Subject>;
    waitForLoader(): Chainable<void>;
    mockPlaylists(playlists?: any[]): Chainable<void>;
    mockPlaylistTracks(playlistId: string, tracks?: any[]): Chainable<void>;
  }
}
