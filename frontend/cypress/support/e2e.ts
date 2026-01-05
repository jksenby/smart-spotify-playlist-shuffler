import './commands';

interface TestContext {
  currentTest?: Mocha.Test;
}

Cypress.on('uncaught:exception', (err: Error) => {
  console.error('Uncaught exception:', err.message);

  if (err.message.includes('ResizeObserver loop')) {
    return false;
  }

  if (err.message.includes('Navigation cancelled')) {
    return false;
  }

  if (err.message.includes('401')) {
    return false;
  }

  return false;
});

beforeEach(() => {
  cy.clearCookies();
  cy.viewport(1280, 720);
});

afterEach(function (this: TestContext) {
  if (this.currentTest && this.currentTest.state === 'failed') {
    const testName = this.currentTest.title.replace(/\s+/g, '-');
    cy.screenshot(`failed-${testName}`, { capture: 'fullPage' });
  }
});

before(() => {
  cy.log('Starting E2E test suite');
});

after(() => {
  cy.log('E2E test suite completed');
});
