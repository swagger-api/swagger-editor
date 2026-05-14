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
 * Editor Preview Pane: API Design Systems
 * Tests for API Design Systems preview rendering
 *
 * Note: The describe block title in Cypress says "AsyncAPI 2.x" but the test is for API Design Systems.
 * This appears to be a copy-paste error in the original Cypress file.
 *
 * Migrated from: test/cypress/e2e/plugin.editor-preview-api-design-systems.cy.js
 */
test.describe('Editor Preview Pane: API Design Systems', () => {
  test.beforeEach(async ({ page }) => {
    await visitBlankPage(page);
    await prepareAsyncAPI(page);
    await prepareOasGenerator(page);
    await waitForSplashScreen(page);
  });

  test('displays API Design Systems', async ({ page }) => {
    // Load API Design Systems example
    await clickNestedMenuItem(page, 'File', 'Load Example', 'API Design Systems');
    await waitForContentPropagation(page);

    // Verify API Design Systems preview elements are visible
    await expect(
      page.locator('.title').filter({ hasText: 'SmartBear API Guidelines' })
    ).toBeVisible();
    await expect(page.locator('.version-stamp > .version')).toBeVisible();
    await expect(page.locator('.version-stamp > .version')).toContainText('ADS');
  });

  test('hidden if not API Design Systems', async ({ page }) => {
    // Load OpenAPI example instead of API Design Systems
    await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 3.0 Petstore');
    await waitForContentPropagation(page);

    // Verify API Design Systems preview elements are not present
    await expect(
      page.locator('.title').filter({ hasText: 'SmartBear API Guidelines' })
    ).not.toBeAttached();
    // Note: Playwright doesn't have .find() like jQuery, so we check if the version stamp contains ADS text
    const versionStamp = page.locator('.version-stamp > .version');
    const versionText = await versionStamp.textContent();
    expect(versionText).not.toContain('ADS');
  });
});
