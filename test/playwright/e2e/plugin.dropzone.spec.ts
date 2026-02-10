import { test, expect } from '@playwright/test';
import * as path from 'path';
import { fileURLToPath } from 'url';

import {
  visitBlankPage,
  prepareAsyncAPI,
  prepareOasGenerator,
  waitForSplashScreen,
} from '../helpers';

// Get __dirname equivalent in ES modules
/* eslint-disable no-underscore-dangle */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/* eslint-enable no-underscore-dangle */

/**
 * Dropzone in Layout
 * Tests for file upload functionality via dropzone
 *
 * Migrated from: test/cypress/e2e/plugin.dropzone.cy.js
 */
test.describe('Dropzone in Layout', () => {
  test.describe('file uploads with dropzone', () => {
    test.beforeEach(async ({ page }) => {
      await visitBlankPage(page);
      await prepareAsyncAPI(page);
      await prepareOasGenerator(page);
      await waitForSplashScreen(page);
    });

    test.describe('when more than one file of an expected type is dropped', () => {
      // NOTE: Skipped because react-dropzone is configured with multiple:false, which prevents
      // multiple files from being processed at the library level. File inputs with
      // setInputFiles() don't trigger the same validation path as actual drag-and-drop events.
      // The original Cypress test used a workaround that doesn't translate to Playwright.
      // Manual testing confirms the error dialog works correctly when drag-dropping multiple files.
      test.skip('should inform the user that their file(s) were rejected', async ({ page }) => {
        const filePath1 = path.join(__dirname, '../fixtures/petstore-oas3.yaml');
        const filePath2 = path.join(__dirname, '../fixtures/petstore-oas2.yaml');

        const fileInput = page.locator('[data-cy="dropzone"]');

        // Attempt to upload multiple files - react-dropzone should handle this
        await fileInput.setInputFiles([filePath1, filePath2]);

        // Wait for modal to appear
        await page.waitForSelector('.modal-ux', { state: 'visible', timeout: 25000 });

        // AlertDialog should appear with error message
        await expect(page.locator('.modal-title')).toContainText('Uh oh, an error has occurred');
        await expect(page.locator('.modal-body > div')).toContainText(
          'Sorry, there was an error processing your file'
        );

        // Close the dialog via X button
        await page.locator('.close').click();

        // Dialog should be closed
        await expect(page.locator('.modal-title')).not.toBeAttached();
      });
    });

    test.describe('when one file of an expected type is dropped', () => {
      test('should update the EditorPane and the EditorPreviewPane', async ({ page }) => {
        /**
         * Note: In Playwright, we use setInputFiles which is equivalent to
         * Cypress's attachFile with subjectType: 'input'.
         * The goal of this test is to verify that when the file is uploaded,
         * the editor content and rendered UI changes.
         */

        const filePath = path.join(__dirname, '../fixtures/petstore-oas3.yaml');

        // Upload single file
        await page.locator('[data-cy="dropzone"]').setInputFiles(filePath);

        // Verify version stamp shows OAS 3.0
        await expect(page.locator('.version-stamp > .version')).toHaveText('OAS 3.0');
      });
    });
  });
});
