import { test, expect } from '@playwright/test';

import {
  visitBlankPage,
  prepareAsyncAPI,
  prepareOasGenerator,
  waitForSplashScreen,
  focusEditorText,
  typeInEditor,
  typeBackspaceInEditor,
  waitForContentPropagation,
} from '../helpers';

/**
 * Monaco Editor with Validation Pane
 * Tests for validation error display in the validation pane
 *
 * Note: Future UX may make the table header <thead> always visible,
 * or existing but collapsed.
 * Expect table body <tbody> to always not exist if there are no errors.
 * Make appropriate changes if/when needed.
 *
 * Migrated from: test/cypress/e2e/plugin.validation-pane.cy.js
 */
test.describe('Monaco Editor with Validation Pane', () => {
  test.beforeEach(async ({ page }) => {
    await visitBlankPage(page);
    await prepareAsyncAPI(page);
    await prepareOasGenerator(page);
    await waitForSplashScreen(page);

    // Move down to line 2, column 3
    await focusEditorText(page, { lineNumber: 2, column: 3 });
    // Introduce a typo error
    await typeInEditor(page, 'Q');
    await waitForContentPropagation(page);
  });

  test('should display visible Validation Pane table header and table body when error exists', async ({
    page,
  }) => {
    // Validation table should exist
    await expect(page.locator('.swagger-editor__validation-table')).toBeAttached();

    // Table header should be visible
    await expect(page.locator('.swagger-editor__validation-table > thead')).toBeVisible();

    // Table body should be visible
    await expect(page.locator('.swagger-editor__validation-table > tbody')).toBeVisible();

    // Verify table headers
    await expect(
      page.locator('.swagger-editor__validation-table > thead > tr > :nth-child(1)')
    ).toContainText(/severity/i);

    await expect(
      page.locator('.swagger-editor__validation-table > thead > tr > :nth-child(2)')
    ).toContainText(/line/i);

    await expect(
      page.locator('.swagger-editor__validation-table > thead > tr > :nth-child(3)')
    ).toContainText(/code/i);

    await expect(
      page.locator('.swagger-editor__validation-table > thead > tr > :nth-child(4)')
    ).toContainText(/message/i);

    // Verify error line number (reflects line number from moveToPosition for validation error)
    // Use .first() to target the first row's line number cell
    await expect(
      page.locator('.swagger-editor__validation-table > tbody td:nth-child(2)').first()
    ).toContainText('1');

    // Verify error message (parser specific)
    // Use .first() to target the first row's message cell - actual error varies
    await expect(
      page.locator('.swagger-editor__validation-table > tbody td:nth-child(4)').first()
    ).toContainText(/must have required property|Object includes not allowed fields/);
  });

  test('should not display Validation Pane after error is cleared', async ({ page }) => {
    // Fix the typo error
    await typeBackspaceInEditor(page);
    await waitForContentPropagation(page);

    // Validation table header and body should not exist
    await expect(page.locator('.swagger-editor__validation-table > thead')).not.toBeAttached();
    await expect(page.locator('.swagger-editor__validation-table > tbody')).not.toBeAttached();
  });
});
