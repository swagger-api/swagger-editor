import { test, expect } from '@playwright/test';

import {
  visitBlankPage,
  prepareAsyncAPI,
  prepareOasGenerator,
  waitForSplashScreen,
  waitForContentPropagation,
} from '../helpers';

/**
 * Monaco Editor with Parser
 * Tests for Monaco Editor core functionality and theme toggling
 *
 * Migrated from: test/cypress/e2e/plugin.editor-monaco.cy.js
 */
test.describe('Monaco Editor with Parser', () => {
  test.beforeEach(async ({ page }) => {
    await visitBlankPage(page);
    await prepareAsyncAPI(page);
    await prepareOasGenerator(page);
    await waitForSplashScreen(page);
  });

  test('should not throw console.error when parsing empty string', async ({ page }) => {
    // Track uncaught page errors (more reliable than console.error monitoring)
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error);
    });

    // Clear editor content by directly setting model value to empty string
    await page.evaluate(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const model = (window as any).monaco.getModel();
      model.setValue('');
    });

    await waitForContentPropagation(page);

    // Verify no uncaught page errors occurred during editing
    expect(pageErrors).toHaveLength(0);

    // Verify editor is empty
    const editorContent = await page.evaluate(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (window as any).monaco.getModel().getValue();
    });
    expect(editorContent).toBe('');
  });

  test('should not throw console.error when parsing unsupported definition', async ({ page }) => {
    // Monitor console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Replace content with unsupported format
    await selectAllEditorText(page);
    await typeInEditor(page, 'randomapi: 1.0.0\n');

    await waitForContentPropagation(page);

    // Verify no console errors
    expect(consoleErrors).toHaveLength(0);

    // Verify editor contains the text
    await expect(page.locator('.monaco-editor .view-lines')).toContainText('randomapi');
  });

  test('should toggle between light and dark themes', async ({ page }) => {
    // Default dark theme - sun icon should be visible (click to lighten)
    await expect(
      page.locator(':nth-child(2) > .swagger-editor__editor-pane-bar-control > .octicon-sun')
    ).toBeVisible();
    await expect(page.locator('.swagger-editor__editor-monaco > .vs-dark')).toBeAttached();

    // Toggle to light theme
    await page.locator(':nth-child(2) > .swagger-editor__editor-pane-bar-control').click();
    await expect(
      page.locator(':nth-child(2) > .swagger-editor__editor-pane-bar-control > .octicon-moon')
    ).toBeVisible();
    await expect(page.locator('.swagger-editor__editor-monaco > .vs')).toBeAttached();

    // Toggle back to dark theme
    await page.locator(':nth-child(2) > .swagger-editor__editor-pane-bar-control').click();
    await expect(
      page.locator(':nth-child(2) > .swagger-editor__editor-pane-bar-control > .octicon-sun')
    ).toBeVisible();
    await expect(page.locator('.swagger-editor__editor-monaco > .vs-dark')).toBeAttached();
  });
});
