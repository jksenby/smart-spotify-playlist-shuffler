describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the main page', () => {
    cy.getByDataCy('page-title').should('contain.text', 'Super Shuffler');
  });

  it('should have login button when not authenticated', () => {
    cy.getByDataCy('login-button').should('be.visible');
  });

  it('should show empty playlist message', () => {
    cy.getByDataCy('empty-playlist-message').should('be.visible');
    cy.getByDataCy('empty-playlist-message').should('contain.text', 'No playlist imported');
  });
});
