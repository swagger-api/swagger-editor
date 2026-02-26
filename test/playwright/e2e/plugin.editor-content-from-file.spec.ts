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
  getAllEditorText,
} from '../helpers';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * EditorContentFromFilePlugin
 * Tests for importing content from URLs
 *
 * Migrated from: test/cypress/e2e/plugin.editor-content-from-file.cy.js
 */
test.describe('EditorContentFromFilePlugin', () => {
  test.beforeEach(async ({ page }) => {
    await visitBlankPage(page);
    await prepareAsyncAPI(page);
    await prepareOasGenerator(page);
    await waitForSplashScreen(page);
  });

  test('should convert JSON to YAML after importing an URL', async ({ page }) => {
    // Mock the import URL
    await page.route('https://example.com/import-example.json', async (route) => {
      const fixturePath = path.join(__dirname, '../fixtures/import-example.json');
      const fixture = await fs.readFile(fixturePath, 'utf-8');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: fixture,
      });
    });

    // Open File > Import URL dialog
    await page.getByText('File', { exact: true }).click();
    await page.getByText('Import URL', { exact: true }).click();

    // Enter URL and submit
    await page.locator('.form-control').fill('https://example.com/import-example.json');
    await page.getByText('OK', { exact: true }).click();

    await waitForContentPropagation(page);

    // Wait for content to load and be visible
    await page.waitForTimeout(1000);

    // Verify content is displayed (use .first() to avoid strict mode violation)
    await expect(page.locator('.view-lines')).toContainText('Example API', { timeout: 10000 });

    // Verify content is converted to YAML
    const editorText = await getAllEditorText(page);
    expect(editorText).toBe(
      'openapi: 3.0.4\ninfo:\n  title: Example API\n  version: 1.0.0\npaths: {}\n'
    );
  });
});
