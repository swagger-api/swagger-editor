import { test, expect } from '@playwright/test';
import * as path from 'path';
import { fileURLToPath } from 'url';

import {
  visitBlankPage,
  prepareAsyncAPI,
  prepareOasGenerator,
  waitForSplashScreen,
  waitForContentPropagation,
  clickNestedMenuItem,
} from '../helpers';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Topbar
 * Tests for top bar menu functionality: File, Edit, Generate, About
 *
 * This is the largest and most complex test file covering:
 * - File menu (import, load examples, save)
 * - Edit menu (clear, convert formats, convert to OpenAPI 3)
 * - Generator menus (server/client code generation with downloads)
 * - About menu
 *
 * Migrated from: test/cypress/e2e/plugin.top-bar.cy.js
 */
test.describe('Topbar', () => {
  test.beforeEach(async ({ page }) => {
    await visitBlankPage(page);
    await prepareAsyncAPI(page);
    await prepareOasGenerator(page);
    await waitForSplashScreen(page);
  });

  test.describe('File Dropdown Menu', () => {
    test('should load file from URL', async ({ page }) => {
      // Open File > Import URL dialog
      await clickNestedMenuItem(page, 'File', 'Import URL');

      // Enter URL
      await page
        .locator('#input-import-url')
        .fill(
          'https://raw.githubusercontent.com/asyncapi/spec/v2.6.0/examples/streetlights-kafka.yml'
        );
      await page.locator('.btn-primary').click();

      // Wait for content to propagate
      await page.waitForTimeout(1000);

      // Verify content is loaded
      const firstLine = page.locator('.view-lines > :nth-child(1)');
      await expect(firstLine).not.toContainText('|'); // applies to both OpenAPI and AsyncAPI cases if yaml improperly loaded
      await expect(firstLine).toContainText('asyncapi');
    });

    test('should render "Import File" menu item', async ({ page }) => {
      await page.getByText('File', { exact: true }).click();
      await expect(page.getByText('Import File', { exact: true })).toBeVisible();
    });

    test('should "Import File" and display rendered changes', async ({ page }) => {
      /**
       * The goal of this test is to see when the file is uploaded that the
       * editor content and rendered UI changes.
       * We directly interact with the file input without needing to open the File Menu.
       */
      const filePath = path.join(__dirname, '../fixtures/petstore-oas3.yaml');
      await page.locator('input[type=file]').setInputFiles(filePath);

      // Wait for generators to load (handled by route mocking in prepareOasGenerator)
      await page.waitForTimeout(500); // Brief wait for content to load

      await expect(page.locator('.version-stamp > .version')).toHaveText('OAS 3.0');
    });

    test.describe('Load Example nested menu', () => {
      test('should load OpenAPI 3.1 Petstore example as YAML', async ({ page }) => {
        await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 3.1 Petstore');
        await waitForContentPropagation(page);

        const firstLine = page.locator('.view-lines > :nth-child(1)');
        await expect(firstLine).toContainText('3.1.0');
        await expect(firstLine).not.toContainText('{');
        await expect(firstLine).not.toContainText('"');
      });

      test('should load OpenAPI 3.0 Petstore example as YAML', async ({ page }) => {
        await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 3.0 Petstore');
        await waitForContentPropagation(page);

        const firstLine = page.locator('.view-lines > :nth-child(1)');
        await expect(firstLine).toContainText('3.0.4');
        await expect(firstLine).not.toContainText('{');
        await expect(firstLine).not.toContainText('"');
      });

      test('should load OpenAPI 2.0 Petstore example as YAML', async ({ page }) => {
        await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 2.0 Petstore');
        await waitForContentPropagation(page);
        // Add extra wait for content to fully load
        await page.waitForTimeout(500);

        const firstLine = page.locator('.view-lines > :nth-child(1)');
        await expect(firstLine).toContainText('swagger');
        // Check that it's YAML format (colon after swagger, not JSON with braces)
        // Note: The content may have quotes around the version number which is valid YAML
        await expect(firstLine).not.toContainText('{');
      });

      test('should load AsyncAPI 2.6 Petstore example as YAML', async ({ page }) => {
        await clickNestedMenuItem(page, 'File', 'Load Example', 'AsyncAPI 2.6 Petstore');
        await waitForContentPropagation(page);

        const thirdLine = page.locator('.view-lines > :nth-child(3)');
        await expect(thirdLine).toContainText('Petstore');
        await expect(thirdLine).not.toContainText('{');
        await expect(thirdLine).not.toContainText('"');
      });

      test('should load AsyncAPI 2.6 Streetlights example as YAML', async ({ page }) => {
        await clickNestedMenuItem(page, 'File', 'Load Example', 'AsyncAPI 2.6 Streetlights');
        await waitForContentPropagation(page);

        const thirdLine = page.locator('.view-lines > :nth-child(3)');
        await expect(thirdLine).toContainText('Streetlights');
        await expect(thirdLine).not.toContainText('{');
        await expect(thirdLine).not.toContainText('"');
      });

      test('should load JSON Schema 2020-12 example as YAML', async ({ page }) => {
        await clickNestedMenuItem(page, 'File', 'Load Example', 'JSON Schema 2020-12');
        await waitForContentPropagation(page);

        const firstLine = page.locator('.view-lines > :nth-child(1)');
        await expect(firstLine).toContainText('2020-12');
        await expect(firstLine).not.toContainText('{');
        await expect(firstLine).not.toContainText('"');
      });

      test('should load API Design Systems example as YAML', async ({ page }) => {
        await clickNestedMenuItem(page, 'File', 'Load Example', 'API Design Systems');
        await waitForContentPropagation(page);

        const firstLine = page.locator('.view-lines > :nth-child(1)');
        await expect(firstLine).toContainText('2021-05-07');
        await expect(firstLine).not.toContainText('{');
        await expect(firstLine).not.toContainText('"');
      });
    });

    test.describe('when content is JSON', () => {
      /**
       * vs. Edit Menu, operation also will initiate a file download without additional user input
       * Final production version might not contain a fixture that we intend to load and display as JSON.
       * So here we assume that we can load a fixture as YAML, then convert to JSON.
       * Then assert expected File Menu item is displayed.
       */
      test('should render clickable text: "Save (as JSON)', async ({ page }) => {
        await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 3.0 Petstore');
        await waitForContentPropagation(page);

        await clickNestedMenuItem(page, 'Edit', 'Convert to JSON');
        await waitForContentPropagation(page);

        await page.getByText('File', { exact: true }).click();
        await expect(page.getByText('Save (as JSON)', { exact: true })).toBeVisible();
      });

      test('should render clickable text: "Convert and Save as YAML', async ({ page }) => {
        await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 3.0 Petstore');
        await waitForContentPropagation(page);

        await clickNestedMenuItem(page, 'Edit', 'Convert to JSON');
        await waitForContentPropagation(page);

        await page.getByText('File', { exact: true }).click();
        await expect(page.getByText('Convert and Save as YAML', { exact: true })).toBeVisible();
      });
    });

    test.describe('when content is YAML', () => {
      test('should render clickable text: "Save (as YAML)', async ({ page }) => {
        await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 3.1 Petstore');
        await waitForContentPropagation(page);

        await page.getByText('File', { exact: true }).click();
        await expect(page.getByText('Save (as YAML)', { exact: true })).toBeVisible();
      });

      test('should render clickable text: "Convert and Save as JSON', async ({ page }) => {
        await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 3.0 Petstore');
        await waitForContentPropagation(page);

        await page.getByText('File', { exact: true }).click();
        await expect(page.getByText('Convert and Save as JSON', { exact: true })).toBeVisible();
      });
    });
  });

  test.describe('Edit Dropdown Menu', () => {
    test('should clear editor', async ({ page }) => {
      await page.getByText('Edit', { exact: true }).click();
      await page.getByText('Clear', { exact: true }).hover();
      await page.getByText('Clear', { exact: true }).click();

      const firstLine = page.locator('.view-lines > :nth-child(1)');
      const content = await firstLine.textContent();
      expect(content?.trim()).toBe('');
    });

    test.describe('given editor content is in YAML format', () => {
      test('displays "Convert To JSON" menu item', async ({ page }) => {
        await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 3.1 Petstore');
        await waitForContentPropagation(page);

        await page.getByText('Edit', { exact: true }).click();
        await expect(page.getByText('Convert to JSON', { exact: true })).toBeVisible();
      });
    });

    test.describe('given editor content is in JSON format', () => {
      test('displays "Convert To YAML" menu item', async ({ page }) => {
        await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 3.1 Petstore');
        await waitForContentPropagation(page);

        await clickNestedMenuItem(page, 'Edit', 'Convert to JSON');
        await waitForContentPropagation(page);

        await page.getByText('Edit', { exact: true }).click();
        await expect(page.getByText('Convert to YAML', { exact: true })).toBeVisible();
      });
    });

    test.describe('"Convert to OpenAPI 3.0.x" menu item', () => {
      test('displays "Convert to OpenAPI 3.0.x" after loading OpenAPI 2.0 fixture', async ({
        page,
      }) => {
        await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 2.0 Petstore');
        await waitForContentPropagation(page);

        await page.getByText('Edit', { exact: true }).click();
        await expect(page.getByText('Convert to OpenAPI 3.0.x', { exact: true })).toBeVisible();
      });

      test('should not display "Convert to OpenAPI 3.0.x" after loading OpenAPI 3.0 fixture', async ({
        page,
      }) => {
        await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 3.0 Petstore');
        await waitForContentPropagation(page);

        await page.getByText('Edit', { exact: true }).click();
        await expect(
          page.getByText('Convert to OpenAPI 3.0.x', { exact: true })
        ).not.toBeAttached();
      });

      test('should not display "Convert to OpenAPI 3.0.x" after loading AsyncAPI 2.6 fixture', async ({
        page,
      }) => {
        await clickNestedMenuItem(page, 'File', 'Load Example', 'AsyncAPI 2.6 Petstore');
        await waitForContentPropagation(page);

        await page.getByText('Edit', { exact: true }).click();
        await expect(
          page.getByText('Convert to OpenAPI 3.0.x', { exact: true })
        ).not.toBeAttached();
      });

      test('should open a confirm dialog for "Convert to OpenAPI 3.0.x" after loading OpenAPI 2.0 fixture', async ({
        page,
      }) => {
        await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 2.0 Petstore');
        await waitForContentPropagation(page);

        await clickNestedMenuItem(page, 'Edit', 'Convert to OpenAPI 3.0.x');

        await expect(page.locator('.modal-title')).toHaveText('Convert to OpenAPI 3.0.x');
      });

      test('should call external http service to "Convert to OpenAPI 3.0.x" after loading OpenAPI 2.0 fixture', async ({
        page,
      }) => {
        await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 2.0 Petstore');
        await waitForContentPropagation(page);

        await clickNestedMenuItem(page, 'Edit', 'Convert to OpenAPI 3.0.x');

        await page.locator('.modal-footer > .btn-primary').click();

        // Wait for conversion to complete (handled by prepareOasGenerator mock)
        await page.waitForTimeout(1500);

        await expect(page.locator('.version-stamp > .version')).toHaveText('OAS 3.0');
      });

      test('should close the confirm dialog for "Convert to OpenAPI 3.0.x" after conversion', async ({
        page,
      }) => {
        await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 2.0 Petstore');
        await waitForContentPropagation(page);

        await clickNestedMenuItem(page, 'Edit', 'Convert to OpenAPI 3.0.x');

        await expect(page.locator('.modal-content')).toBeAttached();
        await page.locator('.modal-footer > .btn-primary').click();

        // Wait for conversion to complete
        await page.waitForTimeout(1500);

        await expect(page.locator('.modal-content')).not.toBeAttached();
      });
    });
  });

  test.describe('Generator Dropdown Menu(s)', () => {
    /**
     * By default, any "Generate Server" or "Generate Client" list
     * is retrieved via an http service
     * Clicking on a specific menu item from one of these lists
     * will auto-download a generated file via an http service
     * without further user action required
     */

    test('should render "Generate Server" and "Generate Client" dropdown menus when OpenAPI 2.0', async ({
      page,
    }) => {
      await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 2.0 Petstore');
      await waitForContentPropagation(page);

      await expect(page.getByText('Generate Server', { exact: true })).toBeVisible();
      await expect(page.getByText('Generate Client', { exact: true })).toBeVisible();
    });

    test('should render "Generate Server" and "Generate Client" dropdown menus when OpenAPI 3.0', async ({
      page,
    }) => {
      await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 3.0 Petstore');
      await waitForContentPropagation(page);

      await expect(page.getByText('Generate Server', { exact: true })).toBeVisible();
      await expect(page.getByText('Generate Client', { exact: true })).toBeVisible();
    });

    test('should render "Generate Server" and "Generate Client" dropdown menus when OpenAPI 3.1', async ({
      page,
    }) => {
      await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 3.1 Petstore');
      await waitForContentPropagation(page);

      // OpenAPI Generator supports OpenAPI 3.1, so menus should be visible
      await expect(page.getByText('Generate Server', { exact: true })).toBeVisible();
      await expect(page.getByText('Generate Client', { exact: true })).toBeVisible();
    });

    test('should NOT render "Generate Server" and "Generate Client" dropdown menus when AsyncAPI 2.6', async ({
      page,
    }) => {
      await clickNestedMenuItem(page, 'File', 'Load Example', 'AsyncAPI 2.6 Petstore');
      await waitForContentPropagation(page);

      await expect(page.getByText('Generate Server', { exact: true })).not.toBeAttached();
      await expect(page.getByText('Generate Client', { exact: true })).not.toBeAttached();
    });

    test('should download a generated OpenAPI 3.0 Server file', async ({ page }) => {
      await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 3.0 Petstore');
      await waitForContentPropagation(page);

      await expect(page.getByText('Generate Server', { exact: true })).toBeVisible();
      await page.getByText('Generate Server', { exact: true }).click();

      // Wait for generator list to load and click mocked response
      await expect(page.getByText('blue', { exact: true })).toBeVisible(); // mocked response value
      await page.getByText('blue', { exact: true }).hover();

      // Set up download promise before clicking
      const downloadPromise = page.waitForEvent('download');
      await page.getByText('blue', { exact: true }).click();

      // Wait for download and verify
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('blue-server-generated.zip');
    });

    test('should download a generated OpenAPI 3.0 Client file', async ({ page }) => {
      await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 3.0 Petstore');
      await waitForContentPropagation(page);

      await expect(page.getByText('Generate Client', { exact: true })).toBeVisible();
      await page.getByText('Generate Client', { exact: true }).click();

      // Wait for generator list to load and click mocked response
      await expect(page.getByText('apple', { exact: true })).toBeVisible(); // mocked response value
      await page.getByText('apple', { exact: true }).hover();

      // Set up download promise before clicking
      const downloadPromise = page.waitForEvent('download');
      await page.getByText('apple', { exact: true }).click();

      // Wait for download and verify
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('apple-client-generated.zip');
    });

    test('should download a generated OpenAPI 2.0 Server file', async ({ page }) => {
      await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 2.0 Petstore');
      await waitForContentPropagation(page);

      await expect(page.getByText('Generate Server', { exact: true })).toBeVisible();
      await page.getByText('Generate Server', { exact: true }).click();

      // Wait for generator list to load and click mocked response
      await expect(page.getByText('blue', { exact: true })).toBeVisible(); // mocked response value
      await page.getByText('blue', { exact: true }).hover();

      // Set up download promise before clicking
      const downloadPromise = page.waitForEvent('download');
      await page.getByText('blue', { exact: true }).click();

      // Wait for download and verify
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('blue-server-generated.zip');
    });

    test('should download a generated OpenAPI 2.0 Client file', async ({ page }) => {
      await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 2.0 Petstore');
      await waitForContentPropagation(page);

      await expect(page.getByText('Generate Client', { exact: true })).toBeVisible();
      await page.getByText('Generate Client', { exact: true }).click();

      // Wait for generator list to load and click mocked response
      await expect(page.getByText('apple', { exact: true })).toBeVisible(); // mocked response value
      await page.getByText('apple', { exact: true }).hover();

      // Set up download promise before clicking
      const downloadPromise = page.waitForEvent('download');
      await page.getByText('apple', { exact: true }).click();

      // Wait for download and verify
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('apple-client-generated.zip');
    });
  });

  test.describe('About Drop Menu', () => {
    test('should have expect menu items', async ({ page }) => {
      await page.getByText('About', { exact: true }).click();
      await expect(page.getByText('About Swagger Editor', { exact: true })).toBeVisible();
      await expect(page.getByText('View Docs', { exact: true })).toBeVisible();
      await expect(page.getByText('View on GitHub', { exact: true })).toBeVisible();
    });
  });
});
