import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for SwaggerEditor E2E tests
 * Migrated from Cypress to Playwright for improved performance and developer experience
 */
export default defineConfig({
  // Test directory
  testDir: './test/playwright/e2e',

  // Maximum time one test can run for
  timeout: 60 * 1000, // 60 seconds

  // Timeout for each assertion
  expect: {
    timeout: 15000, // 15 seconds (matches Cypress splash screen timeout)
  },

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Reporter to use
  reporters: [
    ['html', { outputFolder: 'test/playwright/report' }],
    ['list'],
    ...(process.env.CI ? [['github' as const]] : []),
  ],

  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: 'http://localhost:3000',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Take screenshot on failure
    screenshot: 'only-on-failure',

    // Record video on failure
    video: 'retain-on-failure',

    // Viewport size
    viewport: { width: 1280, height: 1024 },

    // Default timeout for actions (click, fill, etc.)
    actionTimeout: 15000,

    // Default timeout for navigation
    navigationTimeout: 30000,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Optional: enable these for multi-browser testing
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    //
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run pw:dev:server',
    url: 'http://localhost:3000',
    timeout: 120 * 1000, // 120 seconds to start
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
    env: {
      PORT: '3000',
      BROWSER: 'none',
      ENABLE_PROGRESS_PLUGIN: 'false',
      REACT_APP_E2E_TESTS: 'true',
      E2E_TESTS: 'true',
      FAST_REFRESH: 'false',
    },
  },

  // Global setup file (optional)
  // globalSetup: './test/playwright/global-setup.ts',
});
