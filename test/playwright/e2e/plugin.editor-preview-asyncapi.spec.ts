import { test, expect } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

import {
  visitBlankPage,
  prepareAsyncAPI,
  prepareOasGenerator,
  waitForSplashScreen,
  waitForContentPropagation,
  clickNestedMenuItem,
} from '../helpers';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Editor Preview Pane: AsyncAPI 2.x
 * Tests for AsyncAPI preview rendering
 *
 * Migrated from: test/cypress/e2e/plugin.editor-preview-asyncapi.cy.js
 */
test.describe('Editor Preview Pane: AsyncAPI 2.x', () => {
  test.beforeEach(async ({ page }) => {
    await visitBlankPage(page);
    await prepareAsyncAPI(page);
    await prepareOasGenerator(page);
    await waitForSplashScreen(page);
  });

  test('displays AsyncAPI 2.x.x', async ({ page }) => {
    // Load AsyncAPI example
    await clickNestedMenuItem(page, 'File', 'Load Example', 'AsyncAPI 2.6 Streetlights');
    await waitForContentPropagation(page);

    // Verify AsyncAPI preview elements are visible
    await expect(page.locator('#check-out-its-awesome-features')).toBeVisible();
    await expect(page.locator('.aui-root #introduction')).toBeVisible();
  });

  test('hidden if not AsyncAPI 2.x.x', async ({ page }) => {
    // Load OpenAPI example instead of AsyncAPI
    await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 3.0 Petstore');
    await waitForContentPropagation(page);

    // Verify AsyncAPI preview elements are not present
    await expect(page.locator('#check-out-its-awesome-features')).not.toBeAttached();
    await expect(page.locator('.aui-root #introduction')).not.toBeAttached();
  });
});

test.describe('Editor Preview Pane: AsyncAPI 3.x', () => {
  test('displays expandable message payload for resolved definition', async ({ page }) => {
    // Mock the import URL
    await page.route('https://example.com/async-3-messages-resolved.yaml', async (route) => {
      const fixturePath = path.join(__dirname, '../fixtures/async-3-messages-resolved.yaml');
      const fixture = await fs.readFile(fixturePath, 'utf-8');
      await route.fulfill({
        status: 200,
        contentType: 'application/yaml',
        body: fixture,
      });
    });

    // Load the page with the AsyncAPI document
    await prepareOasGenerator(page);
    await Promise.all([
      page.waitForResponse('https://example.com/async-3-messages-resolved.yaml'),
      page.goto('/?url=https://example.com/async-3-messages-resolved.yaml'),
    ]);
    await waitForSplashScreen(page);

    // Verify that the message elements are visible
    const messageContainer = page.locator('#operation-send-test\\.channel-message');
    await expect(messageContainer).toBeVisible();

    const payloadButton = messageContainer.getByRole('button', { name: /payload/i }).first();
    await expect(payloadButton).toBeVisible();

    // Verify that the message payload can be expanded
    await payloadButton.click();

    await expect(messageContainer.getByText(/testField1/)).toBeVisible();
    await expect(messageContainer.getByText(/testField2/)).toBeVisible();
  });
});
