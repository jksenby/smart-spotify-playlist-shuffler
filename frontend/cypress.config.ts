import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://localhost:4200',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    chromeWebSecurity: false,
    experimentalModifyObstructiveThirdPartyCode: true,
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.args.push('--disable-blink-features=AutomationControlled');
          launchOptions.args.push('--disable-features=IsolateOrigins,site-per-process');
        }
        return launchOptions;
      });
      return config;
    },
  },
});
