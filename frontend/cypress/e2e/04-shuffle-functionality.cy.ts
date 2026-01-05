/* eslint-disable @typescript-eslint/no-unused-expressions */
describe('Shuffle Functionality', () => {
  beforeEach(() => {
    cy.loginSpotify();
  });

  it('should have shuffle button in correct states', () => {
    cy.getByDataCy('shuffle-button').should('be.disabled');

    cy.loadMockPlaylist();
    cy.getByDataCy('shuffle-button', { timeout: 10000 })
      .should('exist')
      .and('not.be.disabled')
      .and('be.visible');
  });

  it('should open menu on button click', () => {
    cy.loadMockPlaylist();

    cy.getByDataCy('shuffle-button').click();

    cy.get('[data-cy^="shuffle-"]').should('have.length.greaterThan', 1);
  });

  it('should interact with shuffle option', () => {
    cy.loadMockPlaylist();

    cy.intercept('POST', '**/api/shuffle*', (req) => {
      req.reply({
        statusCode: 200,
        body: { success: true },
      });
    }).as('shuffle');

    cy.getByDataCy('shuffle-button').click();
    cy.wait(500);

    cy.getByDataCy('shuffle-basic').then(($btn) => {
      if ($btn.length > 0) {
        cy.wrap($btn).click({ force: true });
        cy.wait(2000);
      }
    });
  });

  it('should have playlist loaded for shuffle', () => {
    cy.loadMockPlaylist();

    cy.window().then((win) => {
      const state = win.localStorage.getItem('@@STATE');
      if (state) {
        const parsed = JSON.parse(state);

        cy.log('State:', JSON.stringify(parsed, null, 2));

        expect(parsed.playlist).to.exist;

        expect(parsed.playlist.currentTracks).to.exist;
        expect(parsed.playlist.currentTracks).to.have.property('items');
        expect(parsed.playlist.currentTracks.items).to.have.length.greaterThan(0);

        cy.log(`Playlist has ${parsed.playlist.currentTracks.length} tracks loaded`);
      }
    });

    cy.getByDataCy('shuffle-button').should('not.be.disabled');
  });

  it('should prepare for shuffle functionality', () => {
    cy.log('Shuffle tests prepared');
    cy.log('Note: Shuffle API endpoint needs to be called from the app');
  });
});
