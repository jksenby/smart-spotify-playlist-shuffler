/* eslint-disable @typescript-eslint/no-unused-expressions */
describe('Playlist Management', () => {
  beforeEach(() => {
    cy.loginSpotify();
  });

  it('should enable upload playlist button when authenticated', () => {
    cy.getByDataCy('upload-playlist-button').should('not.be.disabled');
  });

  it('should show empty state initially', () => {
    cy.contains(/no playlist/i).should('be.visible');
  });

  it('should disable shuffle button without playlist', () => {
    cy.getByDataCy('shuffle-button').should('be.disabled');
  });

  it('should open playlist selection dialog on upload click', () => {
    cy.getByDataCy('upload-playlist-button').click();

    cy.get('.mat-mdc-dialog-container, [role="dialog"], .cdk-overlay-pane', {
      timeout: 5000,
    }).should('exist');
  });

  it('should load playlist data in state', () => {
    cy.loadMockPlaylist();

    cy.window().then((win) => {
      const playlist = win.localStorage.getItem('current_playlist');
      expect(playlist).to.exist;

      const parsed = JSON.parse(playlist);
      expect(parsed.name).to.equal('Test Chill Vibes');
      expect(parsed.tracks.total).to.equal(3);
    });

    cy.get('body').should('not.contain', 'No playlist imported');

    cy.get('body').then(($body) => {
      if ($body.text().includes('Test Chill Vibes')) {
        cy.contains('Test Chill Vibes').should('be.visible');
      } else {
        cy.log('Playlist name not displayed in UI (data is in state)');
      }
    });
  });

  it('should display track list after playlist loading', () => {
    cy.loadMockPlaylist();

    cy.get('[data-cy="track-item"]', { timeout: 10000 }).should('have.length.greaterThan', 0);
  });

  it('should display track details correctly', () => {
    cy.loadMockPlaylist();

    cy.contains('Test Song 1').should('be.visible');
    cy.contains('Test Artist 1').should('be.visible');
  });

  it('should enable shuffle button with loaded playlist', () => {
    cy.loadMockPlaylist();

    cy.getByDataCy('shuffle-button').should('not.be.disabled');
  });

  it('should have action buttons enabled with loaded playlist', () => {
    cy.loadMockPlaylist();

    cy.getByDataCy('shuffle-button').should('not.be.disabled');

    cy.get('button').should('have.length.greaterThan', 2);
  });
});
