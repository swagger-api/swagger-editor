import { Page } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Setup Helpers - Test preparation and environment setup
 * Converted from Cypress custom commands to Playwright helpers
 */

/**
 * Navigate to about:blank page
 * Cypress equivalent: cy.visitBlankPage()
 */
export async function visitBlankPage(page: Page): Promise<void> {
  await page.goto('about:blank');
}

/**
 * Wait for splash screen to disappear (up to 15 seconds)
 * Cypress equivalent: cy.waitForSplashScreen()
 */
export async function waitForSplashScreen(page: Page): Promise<void> {
  await page.locator('.swagger-editor__splash-screen').waitFor({
    state: 'hidden',
    timeout: 15000,
  });
}

/**
 * Wait for content to propagate through the application
 * Content is debounced by 500ms, so wait 600ms to ensure propagation
 * Cypress equivalent: cy.waitForContentPropagation()
 */
export async function waitForContentPropagation(page: Page): Promise<void> {
  await page.waitForTimeout(600);
}

/**
 * Prepare AsyncAPI test environment
 * Cypress equivalent: cy.prepareAsyncAPI()
 */
export async function prepareAsyncAPI(page: Page): Promise<void> {
  await page.goto('/');
  await waitForSplashScreen(page);
}

/**
 * Prepare OpenAPI 3.0.x test environment with petstore fixture
 * Mocks external petstore API call
 * Cypress equivalent: cy.prepareOpenAPI30x()
 */
export async function prepareOpenAPI30x(page: Page): Promise<void> {
  // Mock the external petstore API
  await page.route('https://petstore3.swagger.io/api/v3/openapi.json', async (route) => {
    const fixturePath = path.join(__dirname, '../fixtures/petstore-oas3.json');
    const fixture = await fs.readFile(fixturePath, 'utf-8');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: fixture,
    });
  });

  await page.goto('/?url=https://petstore3.swagger.io/api/v3/openapi.json');
  await waitForSplashScreen(page);
}

/**
 * Prepare OpenAPI 2.0 test environment with petstore fixture
 * Mocks external petstore API call
 * Cypress equivalent: cy.prepareOpenAPI20()
 */
export async function prepareOpenAPI20(page: Page): Promise<void> {
  // Mock the external petstore API
  await page.route('https://petstore.swagger.io/v2/swagger.yaml', async (route) => {
    const fixturePath = path.join(__dirname, '../fixtures/petstore-oas2.yaml');
    const fixture = await fs.readFile(fixturePath, 'utf-8');
    await route.fulfill({
      status: 200,
      contentType: 'text/yaml',
      body: fixture,
    });
  });

  await page.goto('/?url=https://petstore.swagger.io/v2/swagger.yaml');
  await waitForSplashScreen(page);
}

/**
 * Prepare OAS Generator test environment
 * Mocks all external generator and converter API calls
 * Cypress equivalent: cy.prepareOasGenerator()
 */
export async function prepareOasGenerator(page: Page): Promise<void> {
  const staticResponse = {
    servers: ['blue', 'brown'],
    clients: ['apple', 'avocado'],
  };

  const fixturePath = path.join(__dirname, '../fixtures/rejected.file.1');
  const staticFixture = await fs.readFile(fixturePath, 'utf-8');

  const staticOas2resDownloadUrl = {
    link: 'https://generator.swagger.io/api/gen/download/mocked-hash',
  };

  // OAS3 generator mocks
  await page.route('https://generator3.swagger.io/api/servers', async (route) => {
    await route.fulfill({ json: staticResponse.servers });
  });

  await page.route('https://generator3.swagger.io/api/clients', async (route) => {
    await route.fulfill({ json: staticResponse.clients });
  });

  await page.route('https://generator3.swagger.io/api/generate', async (route) => {
    await route.fulfill({
      status: 200,
      body: staticFixture,
    });
  });

  // OAS2 generator mocks
  await page.route('https://generator.swagger.io/api/gen/servers', async (route) => {
    await route.fulfill({ json: staticResponse.servers });
  });

  await page.route('https://generator.swagger.io/api/gen/clients', async (route) => {
    await route.fulfill({ json: staticResponse.clients });
  });

  await page.route('https://generator.swagger.io/api/gen/servers/*', async (route) => {
    await route.fulfill({ json: staticOas2resDownloadUrl });
  });

  await page.route('https://generator.swagger.io/api/gen/clients/*', async (route) => {
    await route.fulfill({ json: staticOas2resDownloadUrl });
  });

  await page.route('https://generator.swagger.io/api/gen/download/mocked-hash', async (route) => {
    await route.fulfill({
      status: 200,
      body: staticFixture,
    });
  });

  // Converter mock
  const oas3FixturePath = path.join(__dirname, '../fixtures/petstore-oas3.yaml');
  await page.route('https://converter.swagger.io/api/convert', async (route) => {
    const fixture = await fs.readFile(oas3FixturePath, 'utf-8');
    await route.fulfill({
      status: 200,
      contentType: 'text/yaml',
      body: fixture,
    });
  });
}

/**
 * Clear downloads folder
 * Note: In Playwright, downloads are handled per-test with page.waitForEvent('download')
 * This helper is kept for compatibility but may not be needed in most tests
 * Cypress equivalent: cy.clearDownloadsFolder()
 */
export async function clearDownloadsFolder(): Promise<void> {
  const downloadsPath = path.join(__dirname, '../../../cypress/downloads');
  try {
    const files = await fs.readdir(downloadsPath);
    await Promise.all(files.map((file) => fs.unlink(path.join(downloadsPath, file))));
  } catch (error) {
    // Ignore errors if directory doesn't exist
  }
}
