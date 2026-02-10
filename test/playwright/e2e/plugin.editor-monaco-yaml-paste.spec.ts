import { test, expect } from '@playwright/test';

import {
  visitBlankPage,
  prepareOpenAPI20,
  prepareOasGenerator,
  waitForSplashScreen,
  waitForContentPropagation,
  getAllEditorText,
} from '../helpers';

/**
 * EditorMonacoYamlPastePlugin
 * Tests for JSON to YAML conversion when pasting
 *
 * These tests verify that pasting JSON into a YAML editor triggers a conversion dialog
 * and properly converts the JSON to YAML format with appropriate indentation.
 *
 * The tests use Monaco's API directly to dispatch paste events to the editor's textarea,
 * which reliably triggers the paste event handler in automated testing.
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
    test('should convert JSON to YAML', async ({ page }) => {
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

      // Select all text using Monaco API and then paste
      await page.evaluate((text) => {
        const editor = (window as any).monaco;
        const model = editor.getModel();
        const fullRange = model.getFullModelRange();

        // Select all text
        editor.setSelection(fullRange);
        editor.focus();

        // Create and dispatch paste event with the selection range
        const clipboardData = new DataTransfer();
        clipboardData.setData('text', text);
        const pasteEvent = new ClipboardEvent('paste', {
          bubbles: true,
          cancelable: true,
          clipboardData,
        });

        const editorDomNode = editor.getDomNode();
        const textArea = editorDomNode.querySelector('textarea');
        if (textArea) {
          textArea.dispatchEvent(pasteEvent);
        }
      }, jsonText);

      // Wait for paste event to be processed
      await page.waitForTimeout(500);

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

    test('should add padding', async ({ page }) => {
      // First paste YAML to replace all content
      const yamlText =
        'openapi: 3.1.0\ninfo:\n  title: Swagger Petstore - OpenAPI 3.1\n  version: 1.0.11\n  ';

      await page.evaluate((text) => {
        const editor = (window as any).monaco;
        const model = editor.getModel();
        const fullRange = model.getFullModelRange();

        // Replace all content with YAML
        editor.executeEdits('', [{ range: fullRange, text, forceMoveMarkers: true }]);
      }, yamlText);

      await waitForContentPropagation(page);

      // Position cursor at end and paste JSON (should be converted and padded)
      const jsonText =
        '{"termsOfService":"http://swagger.io/terms/","contact":{"email": "apiteam@swagger.io"}}';

      await page.evaluate((text) => {
        const editor = (window as any).monaco;
        const model = editor.getModel();
        const lastLine = model.getLineCount();
        const lastColumn = model.getLineMaxColumn(lastLine);

        // Position cursor at the end
        editor.setPosition({ lineNumber: lastLine, column: lastColumn });
        editor.focus();

        // Dispatch paste event
        const clipboardData = new DataTransfer();
        clipboardData.setData('text', text);
        const pasteEvent = new ClipboardEvent('paste', {
          bubbles: true,
          cancelable: true,
          clipboardData,
        });

        const editorDomNode = editor.getDomNode();
        const textArea = editorDomNode.querySelector('textarea');
        if (textArea) {
          textArea.dispatchEvent(pasteEvent);
        }
      }, jsonText);

      await page.waitForTimeout(500);

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
