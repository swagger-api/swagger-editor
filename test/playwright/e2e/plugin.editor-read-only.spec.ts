import { test, expect } from '@playwright/test';

import {
  visitBlankPage,
  prepareAsyncAPI,
  prepareOasGenerator,
  waitForSplashScreen,
  isEditorReadOnly,
} from '../helpers';

/**
 * Read Only Plugin
 * Tests for toggling editor read-only mode
 *
 * Migrated from: test/cypress/e2e/plugin.editor-read-only.cy.js
 */
test.describe('read only', () => {
  test.beforeEach(async ({ page }) => {
    await visitBlankPage(page);
    await prepareAsyncAPI(page);
    await prepareOasGenerator(page);
    await waitForSplashScreen(page);
  });

  test('should toggle between allow-write and read-only', async ({ page }) => {
    // Default allow-write - unlock icon should be visible
    await expect(
      page.locator(':nth-child(1) > .swagger-editor__editor-pane-bar-control > .octicon-unlock')
    ).toBeVisible();
    expect(await isEditorReadOnly(page)).toBe(false);

    // Toggle to read-only
    await page.locator(':nth-child(1) > .swagger-editor__editor-pane-bar-control').click();
    await expect(
      page.locator(':nth-child(1) > .swagger-editor__editor-pane-bar-control > .octicon-lock')
    ).toBeVisible();
    expect(await isEditorReadOnly(page)).toBe(true);

    // Toggle back to allow-write
    await page.locator(':nth-child(1) > .swagger-editor__editor-pane-bar-control').click();
    await expect(
      page.locator(':nth-child(1) > .swagger-editor__editor-pane-bar-control > .octicon-unlock')
    ).toBeVisible();
    expect(await isEditorReadOnly(page)).toBe(false);
  });
});
