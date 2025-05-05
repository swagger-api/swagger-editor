/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'cypress';

import setupNodeEvents from './test/cypress/support/setup-node-events.js';

export default defineConfig({
  fileServerFolder: 'test/cypress/static',
  fixturesFolder: 'test/cypress/fixtures',
  screenshotsFolder: 'test/cypress/screenshots',
  videosFolder: 'test/cypress/videos',
  video: false,
  e2e: {
    baseUrl: 'http://localhost:3000/',
    supportFile: 'test/cypress/support/e2e.js',
    specPattern: 'test/cypress/e2e/**/*.cy.js',
    setupNodeEvents,
  },
});
