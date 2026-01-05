describe('Authentication Flow', () => {
  it('should show login button when not authenticated', () => {
    cy.intercept('GET', '**/auth/me', {
      statusCode: 401,
      body: { error: 'Unauthorized' },
    });

    cy.visit('/');

    cy.getByDataCy('login-button').should('be.visible');
    cy.getByDataCy('login-button').should('be.enabled');
  });

  it('should disable upload button when not authenticated', () => {
    cy.intercept('GET', '**/auth/me', {
      statusCode: 401,
      body: { error: 'Unauthorized' },
    });

    cy.visit('/');
    cy.getByDataCy('upload-playlist-button').should('be.disabled');
  });

  it('should show user menu after mock login', () => {
    cy.loginSpotify();
    cy.getByDataCy('user-menu-button').should('be.visible');
    cy.getByDataCy('user-display-name').should('contain.text', 'Test User');
  });

  it('should enable upload button after login', () => {
    cy.loginSpotify();
    cy.getByDataCy('upload-playlist-button').should('not.be.disabled');
  });

  it('should display user avatar after login', () => {
    cy.loginSpotify();
    cy.getByDataCy('user-avatar').should('be.visible');
    cy.getByDataCy('user-avatar').should('have.attr', 'src').and('include', 'placeholder');
  });

  it('should logout successfully', () => {
    cy.loginSpotify();

    cy.getByDataCy('user-menu-button').click();
    cy.getByDataCy('logout-button').should('be.visible').click();

    cy.get('[data-cy="login-button"]', { timeout: 10000 }).should('be.visible');
  });

  it('should clear session data on logout', () => {
    cy.loginSpotify();

    cy.getByDataCy('user-menu-button').click();
    cy.getByDataCy('logout-button').click();

    cy.get('[data-cy="login-button"]', { timeout: 10000 }).should('be.visible');
  });

  it('should handle OAuth callback correctly', () => {
    cy.mockSpotifyApi();
    cy.visit('/callback?code=test_code&state=test_state');

    cy.url({ timeout: 10000 }).should('not.include', '/callback');
  });

  it('should persist session on page reload', () => {
    cy.loginSpotify();

    cy.reload();

    cy.wait('@getCurrentUser');
    cy.getByDataCy('user-menu-button').should('be.visible');
  });
});
