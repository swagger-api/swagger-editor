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
      // This test remains skipped due to fundamental limitations in simulating drag-and-drop
      // events with multiple files in automated testing. React-dropzone's event handlers
      // expect real browser drag-and-drop events with DataTransfer objects that contain
      // actual File objects from the file system. Synthetic events created via
      // JavaScript (new DragEvent, dispatchEvent, etc.) don't properly trigger
      // react-dropzone's internal validation logic because:
      // 1. DataTransfer.files is read-only and can't be set on synthetic events
      // 2. React-dropzone uses internal event handling that doesn't respond to dispatched events
      // 3. Directly calling React component callbacks requires accessing internal Fiber state
      //    which is fragile and implementation-dependent
      //
      // The feature works correctly in manual testing - when users actually drag-and-drop
      // multiple files, react-dropzone properly rejects them and shows the error dialog.
      // This has been verified manually.
      test.skip('should inform the user that their file(s) were rejected', async ({ page }) => {
        const filePath1 = path.join(__dirname, '../fixtures/petstore-oas3.yaml');
        const filePath2 = path.join(__dirname, '../fixtures/petstore-oas2.yaml');

        const fs = await import('fs/promises');
        const file1Content = await fs.readFile(filePath1, 'utf-8');
        const file2Content = await fs.readFile(filePath2, 'utf-8');

        // Set multiple files on the input element and dispatch change event
        // React-dropzone listens to both drop and change events on the input
        await page.evaluate(
          ({ file1, file2 }) => {
            // Create File objects
            const blob1 = new Blob([file1], { type: 'application/x-yaml' });
            const blob2 = new Blob([file2], { type: 'application/x-yaml' });
            const fileObj1 = new File([blob1], 'petstore-oas3.yaml', {
              type: 'application/x-yaml',
            });
            const fileObj2 = new File([blob2], 'petstore-oas2.yaml', {
              type: 'application/x-yaml',
            });

            // Find the file input element
            const input = document.querySelector('[data-cy="dropzone"]') as HTMLInputElement;
            const dropzoneRoot = document.querySelector('.dropzone');

            if (!input || !dropzoneRoot) {
              throw new Error('Required elements not found');
            }

            // Create DataTransfer with multiple files
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(fileObj1);
            dataTransfer.items.add(fileObj2);

            // Set files property on the input (this bypasses the multiple:false validation)
            Object.defineProperty(input, 'files', {
              value: dataTransfer.files,
              writable: false,
              configurable: true,
            });

            // Dispatch drop event on dropzone root with the files
            // This is what react-dropzone listens to
            const dropEvent = new DragEvent('drop', {
              bubbles: true,
              cancelable: true,
            });

            // Override dataTransfer getter to return our DataTransfer
            Object.defineProperty(dropEvent, 'dataTransfer', {
              value: dataTransfer,
              writable: false,
            });

            dropzoneRoot.dispatchEvent(dropEvent);
          },
          { file1: file1Content, file2: file2Content }
        );

        // Wait for React to process
        await page.waitForTimeout(500);

        // Wait for modal to appear
        await page.waitForSelector('.modal-ux', { state: 'visible', timeout: 5000 });

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
