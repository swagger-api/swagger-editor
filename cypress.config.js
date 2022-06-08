/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'cypress';

import setupNodeEvents from './test/cypress/plugins/index.js';

export default defineConfig({
  fileServerFolder: 'test/cypress/static',
  fixturesFolder: 'test/cypress/fixtures',
  screenshotsFolder: 'test/cypress/screenshots',
  videosFolder: 'test/cypress/videos',
  video: false,
  e2e: {
    baseUrl: 'http://localhost:3050/',
    supportFile: 'test/cypress/support/e2e.js',
    specPattern: 'test/cypress/integration/**/*spec.js',
    setupNodeEvents,
  },
});
