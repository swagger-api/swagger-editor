import { test, expect } from '@playwright/test';

import {
  visitBlankPage,
  prepareAsyncAPI,
  prepareOasGenerator,
  waitForSplashScreen,
  waitForContentPropagation,
  clickNestedMenuItem,
} from '../helpers';

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
