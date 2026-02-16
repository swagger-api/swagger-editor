import { test, expect } from '@playwright/test';

import {
  visitBlankPage,
  prepareAsyncAPI,
  prepareOasGenerator,
  waitForSplashScreen,
  selectEditorText,
  typeInEditor,
  waitForContentPropagation,
} from '../helpers';

/**
 * EditorPersistencePlugin
 * Tests for LocalStorage persistence of editor content
 *
 * Migrated from: test/cypress/e2e/plugin.editor-persistence.cy.js
 */
test.describe('EditorPersistencePlugin', () => {
  test.beforeEach(async ({ page }) => {
    await visitBlankPage(page);
    await prepareOasGenerator(page);
  });

  test('should load definition', async ({ page }) => {
    await prepareAsyncAPI(page);
    await waitForSplashScreen(page);

    // Verify AsyncAPI content is loaded
    await expect(page.locator('.monaco-editor .view-lines')).toContainText('asyncapi');
    await expect(page.locator('.monaco-editor .view-lines')).toContainText('2.6.0');
  });

  test('should reload while keeping text change from 2.6.0 to 2.5.0', async ({ page }) => {
    await prepareAsyncAPI(page);
    await waitForSplashScreen(page);

    // Change version from 2.6.0 to 2.5.0
    await selectEditorText(page, {
      startLineNumber: 1,
      startColumn: 14,
      endLineNumber: 1,
      endColumn: 15,
    });
    await typeInEditor(page, '5');

    // Verify change is visible
    await expect(page.locator('.monaco-editor .view-lines')).toContainText('2.5.0');
    await expect(page.locator('.monaco-editor .view-lines')).not.toContainText('2.6.0');

    await waitForContentPropagation(page);

    // Wait for localStorage to be updated and verify the change is persisted
    await page.waitForFunction(
      () => {
        const content = localStorage.getItem('swagger-editor-content');
        return content !== null && content.includes('2.5.0') && !content.includes('2.6.0');
      },
      { timeout: 5000 }
    );

    // Reload page
    await page.reload();

    // Verify change persisted after reload
    await waitForSplashScreen(page);
    await expect(page.locator('.monaco-editor .view-lines')).toContainText('2.5.0');
    await expect(page.locator('.monaco-editor .view-lines')).not.toContainText('2.6.0');
  });
});
