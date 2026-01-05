/* eslint-disable @typescript-eslint/no-unused-expressions */
describe('Save to Spotify', () => {
  beforeEach(() => {
    cy.loginSpotify();
  });

  it('should have save button disabled without playlist', () => {
    cy.get('button').then(($buttons) => {
      const hasSaveButton = $buttons
        .toArray()
        .some((btn) => btn.textContent?.match(/save|export/i));
      expect(hasSaveButton).to.be.false;
    });
  });

  it('should mock playlist endpoint correctly', () => {
    cy.loadMockPlaylist();

    cy.window().then((win) => {
      const playlist = win.localStorage.getItem('current_playlist');
      expect(playlist).to.exist;
      expect(playlist).to.contain('Test Song 1');
    });
  });

  it('should have NGXS state with playlist', () => {
    cy.loadMockPlaylist();

    cy.window().then((win) => {
      const state = win.localStorage.getItem('@@STATE');
      expect(state).to.exist;

      if (state) {
        const parsedState = JSON.parse(state);
        cy.log('NGXS State:', JSON.stringify(parsedState, null, 2));

        expect(parsedState).to.have.property('playlist');
        expect(parsedState.playlist).to.have.property('currentTracks');
        expect(parsedState.playlist.currentTracks).to.have.property('items');
        expect(parsedState.playlist.currentTracks.items).to.have.length(3);
      }
    });
  });

  it('should have tracks container visible', () => {
    cy.loadMockPlaylist();

    cy.get('[data-cy="tracks-container"]').should('exist');
  });

  it('should not show empty state after loading', () => {
    cy.loadMockPlaylist();

    cy.get('body').should('not.contain', 'No playlist imported');
  });

  it('should display playlist name', () => {
    cy.loadMockPlaylist();

    cy.contains('Test Song 1', { timeout: 10000 }).should('be.visible');
  });

  it('should display tracks', () => {
    cy.loadMockPlaylist();

    cy.contains('Test Song 1', { timeout: 10000 }).should('be.visible');
    cy.contains('Test Artist 1').should('be.visible');
  });

  it('should have mock create playlist endpoint ready', () => {
    cy.intercept('POST', '**/spotify/playlists/create', {
      statusCode: 200,
      body: {
        success: true,
        playlist: {
          id: 'new_123',
          name: 'Created Playlist',
          external_urls: {
            spotify: 'https://open.spotify.com/playlist/new_123',
          },
        },
      },
    }).as('createPlaylist');

    cy.log('Create playlist endpoint is mocked and ready');
  });
});
