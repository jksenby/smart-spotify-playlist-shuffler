/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="cypress" />

declare global {
  interface Window {
    localStorage: Storage;
    getAllAngularTestabilities?: () => any[];
    ['@@NGXS']: any; // NGXS Store
  }
}

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      loginSpotify(token?: string): Chainable<void>;
      mockSpotifyApi(): Chainable<void>;
      loadMockPlaylist(): Chainable<void>;
      getByDataCy(
        value: string,
        options?: Partial<Loggable & Timeoutable & Withinable & Shadow>,
      ): Chainable<JQuery<HTMLElement>>;
      dataCy(
        value: string,
        options?: Partial<Loggable & Timeoutable & Withinable & Shadow>,
      ): Chainable<JQuery<HTMLElement>>;
      waitForAngular(): Chainable<void>;
      shouldBeInteractive(): Chainable<Subject>;
      typeRealistic(text: string, delay?: number): Chainable<Subject>;
      waitForLoader(): Chainable<void>;
      mockPlaylists(playlists?: any[]): Chainable<void>;
      mockPlaylistTracks(playlistId: string, tracks?: any[]): Chainable<void>;
    }
  }
}

Cypress.Commands.add('mockSpotifyApi', () => {
  cy.log('Mocking Spotify API');

  cy.intercept('GET', '**/auth/me', {
    statusCode: 200,
    fixture: 'user.json',
  }).as('getCurrentUser');

  cy.intercept('GET', '**/api/spotify/me', {
    statusCode: 200,
    fixture: 'user.json',
  }).as('getUserProfile');

  cy.intercept('GET', '**/spotify/playlists/current', {
    statusCode: 404,
    body: { error: 'No current playlist' },
  }).as('getCurrentPlaylist');

  cy.intercept('GET', '**/api/spotify/playlists*', {
    statusCode: 200,
    fixture: 'playlists.json',
  }).as('getPlaylists');

  cy.intercept('GET', '**/api/spotify/playlists/*', {
    statusCode: 200,
    fixture: 'playlist.json',
  }).as('getPlaylistDetails');

  cy.intercept('POST', '**/api/shuffle*', {
    statusCode: 200,
    body: {
      success: true,
      message: 'Playlist shuffled successfully',
      shuffled_tracks: [],
    },
    delay: 1000,
  }).as('shufflePlaylist');

  cy.intercept('POST', '**/api/save*', {
    statusCode: 200,
    body: {
      success: true,
      message: 'Playlist saved successfully',
      playlist_id: 'new_playlist_123',
    },
    delay: 1000,
  }).as('savePlaylist');

  cy.intercept('GET', '**/auth/logout', {
    statusCode: 200,
    body: { success: true },
  }).as('logoutGet');

  cy.intercept('POST', '**/auth/logout', {
    statusCode: 200,
    body: { success: true },
  }).as('logoutPost');

  cy.intercept('POST', '**/spotify/playlists/create', {
    statusCode: 200,
    body: {
      success: true,
      message: 'Playlist created successfully',
      playlist: {
        id: 'new_playlist_123',
        name: 'Created Playlist',
        external_urls: {
          spotify: 'https://open.spotify.com/playlist/new_playlist_123',
        },
      },
    },
  }).as('createPlaylist');
});

Cypress.Commands.add('loginSpotify', (token = 'mock_spotify_token_12345') => {
  cy.log('Logging in with Spotify');

  cy.mockSpotifyApi();

  cy.visit('/', {
    onBeforeLoad(win) {
      win.localStorage.setItem('spotify_access_token', token);
      win.localStorage.setItem('spotify_refresh_token', 'mock_refresh_token_67890');
      win.localStorage.setItem('spotify_token_expiry', String(Date.now() + 3600000));
      win.localStorage.setItem(
        'user_profile',
        JSON.stringify({
          id: 'test_user_123',
          display_name: 'Test User',
          email: 'test@example.com',
          images: [{ url: 'https://via.placeholder.com/150' }],
        }),
      );
    },
  });

  cy.wait('@getCurrentUser', { timeout: 10000 });
});

Cypress.Commands.add('dataCy', (value: string, options?: any) => {
  return cy.get(`[data-cy="${value}"]`, options);
});

Cypress.Commands.add('getByDataCy', (value: string, options?: any) => {
  return cy.get(`[data-cy="${value}"]`, options);
});

Cypress.Commands.add('waitForAngular', () => {
  cy.window().then((win: Window) => {
    if (win.getAllAngularTestabilities) {
      return new Cypress.Promise<void>((resolve) => {
        const testabilities = win.getAllAngularTestabilities();
        if (!testabilities || testabilities.length === 0) {
          return resolve();
        }
        let count = testabilities.length;
        testabilities.forEach((testability: any) => {
          testability.whenStable(() => {
            count--;
            if (count === 0) {
              resolve();
            }
          });
        });
      });
    }
  });
});

Cypress.Commands.add(
  'shouldBeInteractive',
  { prevSubject: true },
  (subject: JQuery<HTMLElement>) => {
    cy.wrap(subject).should('be.visible').should('be.enabled').should('not.be.disabled');
    return cy.wrap(subject);
  },
);

Cypress.Commands.add(
  'typeRealistic',
  { prevSubject: true },
  (subject: JQuery<HTMLElement>, text: string, delay = 100) => {
    cy.wrap(subject).clear();
    for (const char of text) {
      cy.wrap(subject).type(char, { delay });
    }
    return cy.wrap(subject);
  },
);

Cypress.Commands.add('waitForLoader', () => {
  cy.log('Waiting for loader to disappear');
  cy.get(
    '.loader, .spinner, [data-cy="loader"], [data-cy="shuffle-progress"], [data-cy="save-progress"]',
    {
      timeout: 15000,
    },
  ).should('not.exist');
});

Cypress.Commands.add('mockPlaylists', (playlists?: any[]) => {
  const defaultPlaylists = playlists || [
    {
      id: '1',
      name: 'Chill Vibes',
      description: 'Relaxing music for work',
      tracks: { total: 50 },
      images: [{ url: 'https://via.placeholder.com/300' }],
      owner: { display_name: 'Test User' },
    },
    {
      id: '2',
      name: 'Workout Mix',
      description: 'High energy workout music',
      tracks: { total: 30 },
      images: [{ url: 'https://via.placeholder.com/300' }],
      owner: { display_name: 'Test User' },
    },
  ];

  cy.intercept('GET', '**/api/spotify/playlists*', {
    statusCode: 200,
    body: { items: defaultPlaylists },
  }).as('getPlaylists');
});

Cypress.Commands.add('mockPlaylistTracks', (playlistId: string, tracks?: any[]) => {
  const defaultTracks = tracks || [
    {
      id: 'track1',
      name: 'Song One',
      artists: [{ name: 'Artist One' }],
      album: { name: 'Album One', images: [{ url: 'https://via.placeholder.com/64' }] },
      duration_ms: 180000,
    },
    {
      id: 'track2',
      name: 'Song Two',
      artists: [{ name: 'Artist Two' }],
      album: { name: 'Album Two', images: [{ url: 'https://via.placeholder.com/64' }] },
      duration_ms: 200000,
    },
  ];

  cy.intercept('GET', `**/api/spotify/playlists/${playlistId}/tracks*`, {
    statusCode: 200,
    body: { items: defaultTracks.map((t) => ({ track: t })) },
  }).as('getPlaylistTracks');
});

Cypress.Commands.add('loadMockPlaylist', () => {
  cy.log('Loading mock playlist');

  const mockPlaylistData = {
    id: 'test_playlist_123',
    name: 'Test Chill Vibes',
    description: 'Test playlist for E2E',
    images: [{ url: 'https://via.placeholder.com/300', height: 300, width: 300 }],
    owner: { display_name: 'Test User', id: 'test_user_123' },
    tracks: {
      total: 3,
      items: [
        {
          track: {
            id: 'track1',
            name: 'Test Song 1',
            duration_ms: 240000,
            uri: 'spotify:track:track1',
            artists: [{ name: 'Test Artist 1', id: 'artist1' }],
            album: {
              name: 'Test Album 1',
              id: 'album1',
              images: [{ url: 'https://via.placeholder.com/64' }],
            },
          },
        },
        {
          track: {
            id: 'track2',
            name: 'Test Song 2',
            duration_ms: 180000,
            uri: 'spotify:track:track2',
            artists: [{ name: 'Test Artist 2', id: 'artist2' }],
            album: {
              name: 'Test Album 2',
              id: 'album2',
              images: [{ url: 'https://via.placeholder.com/64' }],
            },
          },
        },
        {
          track: {
            id: 'track3',
            name: 'Test Song 3',
            duration_ms: 200000,
            uri: 'spotify:track:track3',
            artists: [{ name: 'Test Artist 3', id: 'artist3' }],
            album: {
              name: 'Test Album 3',
              id: 'album3',
              images: [{ url: 'https://via.placeholder.com/64' }],
            },
          },
        },
      ],
    },
  };

  cy.intercept('GET', '**/spotify/playlists/current*', {
    statusCode: 200,
    body: mockPlaylistData,
  }).as('getCurrentPlaylist');

  cy.intercept('GET', '**/api/playlists/current*', {
    statusCode: 200,
    body: mockPlaylistData,
  }).as('getCurrentPlaylistApi');

  cy.intercept('GET', '**/playlists/current*', {
    statusCode: 200,
    body: mockPlaylistData,
  }).as('getCurrentPlaylistShort');

  cy.window().then((win) => {
    win.localStorage.setItem('current_playlist', JSON.stringify(mockPlaylistData));
    win.localStorage.setItem('current_playlist_id', 'test_playlist_123');

    try {
      const stateKey = '@@STATE';
      let currentState: any = {};

      try {
        const storedState = win.localStorage.getItem(stateKey);
        if (storedState) {
          currentState = JSON.parse(storedState);
        }
      } catch (e) {
        console.error(e);
        currentState = {};
      }

      const updatedState = {
        ...currentState,
        auth: currentState.auth || {
          user: {
            id: 'test_user_123',
            display_name: 'Test User',
            email: 'test@example.com',
          },
          loading: false,
          error: null,
        },
        playlist: {
          currentPlaylist: mockPlaylistData,
          currentTracks: mockPlaylistData.tracks.items,
          loading: false,
          error: null,
        },
      };

      win.localStorage.setItem(stateKey, JSON.stringify(updatedState));
      cy.log('NGXS state updated with playlist data');
    } catch (e) {
      cy.log('Could not update NGXS state:', e);
    }
  });

  cy.reload();
  cy.mockSpotifyApi();

  cy.waitForAngular();
  cy.wait(500);

  cy.log('Mock playlist loaded');
});

export {};
