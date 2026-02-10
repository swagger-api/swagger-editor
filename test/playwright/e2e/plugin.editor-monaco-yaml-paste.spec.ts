import { test, expect } from '@playwright/test';

import {
  visitBlankPage,
  prepareOpenAPI20,
  prepareOasGenerator,
  waitForSplashScreen,
  selectAllEditorText,
  waitForContentPropagation,
  getAllEditorText,
} from '../helpers';

/**
 * EditorMonacoYamlPastePlugin
 * Tests for JSON to YAML conversion when pasting
 *
 * NOTE: These tests are skipped because the Monaco YAML paste plugin's conversion dialog
 * does not trigger reliably in automated testing environments (Playwright, Cypress headless).
 * The plugin requires genuine clipboard interaction which is difficult to simulate programmatically.
 *
 * The feature works correctly in manual testing but cannot be reliably tested in automation.
 * This is the same limitation that existed in the original Cypress tests.
 *
 * Migrated from: test/cypress/e2e/plugin.editor-monaco-yaml-paste.cy.js
 */
test.describe('EditorMonacoYamlPastePlugin', () => {
  test.beforeEach(async ({ page, context }) => {
    // Grant clipboard permissions for paste to work properly
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await visitBlankPage(page);
    await prepareOpenAPI20(page);
    await prepareOasGenerator(page);
    await waitForSplashScreen(page);
  });

  test.describe('when I replace the text in editor by pasting a new JSON text', () => {
    test.skip('should convert JSON to YAML', async ({ page }) => {
      await selectAllEditorText(page);

      const jsonText = `{
            "openapi": "3.1.0",
            "info": {
              "title": "Swagger Petstore - OpenAPI 3.1",
              "version": "1.0.11",
              "termsOfService": "http://swagger.io/terms/",
              "contact": {
                "email": "apiteam@swagger.io"
              }
            }
          }`;

      // Write to clipboard and paste using keyboard
      await page.evaluate(async (text) => {
        await navigator.clipboard.writeText(text);
      }, jsonText);

      // Focus editor and paste with keyboard
      await page.locator('.monaco-editor').click();
      const isMac = process.platform === 'darwin';
      const modifier = isMac ? 'Meta' : 'Control';
      await page.keyboard.press(`${modifier}+KeyV`);

      await waitForContentPropagation(page);

      // Wait for and click OK button in conversion dialog (use more flexible selector)
      const okButton = page.locator('button:has-text("OK")').first();
      await expect(okButton).toBeVisible({ timeout: 10000 });
      await okButton.click();

      // Wait for conversion to complete
      await waitForContentPropagation(page);

      // Verify content is converted to YAML
      const editorText = await getAllEditorText(page);
      expect(editorText).toBe(
        'openapi: 3.1.0\ninfo:\n  title: Swagger Petstore - OpenAPI 3.1\n  version: 1.0.11\n  termsOfService: http://swagger.io/terms/\n  contact:\n    email: apiteam@swagger.io\n'
      );
    });

    test.skip('should add padding', async ({ page }) => {
      await selectAllEditorText(page);

      // First paste YAML
      const yamlText =
        'openapi: 3.1.0\ninfo:\n  title: Swagger Petstore - OpenAPI 3.1\n  version: 1.0.11\n  ';

      await page.evaluate(async (text) => {
        await navigator.clipboard.writeText(text);
      }, yamlText);

      await page.locator('.monaco-editor').click();
      const isMac = process.platform === 'darwin';
      const modifier = isMac ? 'Meta' : 'Control';
      await page.keyboard.press(`${modifier}+KeyV`);

      await waitForContentPropagation(page);

      // Then paste JSON (should be converted and padded)
      const jsonText =
        '{"termsOfService":"http://swagger.io/terms/","contact":{"email": "apiteam@swagger.io"}}';

      await page.evaluate(async (text) => {
        await navigator.clipboard.writeText(text);
      }, jsonText);

      await page.keyboard.press(`${modifier}+KeyV`);
      await waitForContentPropagation(page);

      // Wait for and click OK button in conversion dialog (use more flexible selector)
      const okButton = page.locator('button:has-text("OK")').first();
      await expect(okButton).toBeVisible({ timeout: 10000 });
      await okButton.click();

      // Wait for conversion to complete
      await waitForContentPropagation(page);

      // Verify content with proper padding
      const editorText = await getAllEditorText(page);
      expect(editorText).toBe(
        'openapi: 3.1.0\ninfo:\n  title: Swagger Petstore - OpenAPI 3.1\n  version: 1.0.11\n  termsOfService: http://swagger.io/terms/\n  contact:\n    email: apiteam@swagger.io\n  '
      );
    });
  });
});
