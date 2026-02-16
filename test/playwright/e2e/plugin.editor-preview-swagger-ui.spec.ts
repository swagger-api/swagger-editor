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
 * Editor Preview Pane: OpenAPI 2.0, 3.0.x, 3.1.x
 * Tests for SwaggerUI preview rendering of OpenAPI specifications
 *
 * Note: `.title` and `.version-stamp` are SwaggerUI-specific CSS classes
 * that should only appear in the preview pane, not in the editor.
 *
 * Migrated from: test/cypress/e2e/plugin.editor-preview-swagger-ui.cy.js
 */
test.describe('Editor Preview Pane: OpenAPI 2.0, 3.0.x, 3.1.x', () => {
  test.beforeEach(async ({ page }) => {
    await visitBlankPage(page);
    await prepareAsyncAPI(page);
    await prepareOasGenerator(page);
    await waitForSplashScreen(page);
  });

  test('should display OpenAPI 2.0', async ({ page }) => {
    // Load OpenAPI 2.0 example
    await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 2.0 Petstore');
    await waitForContentPropagation(page);

    await expect(page.locator('.title').filter({ hasText: 'Swagger Petstore 2.0' })).toBeVisible();
    await expect(page.locator('.version-stamp > .version')).toBeVisible();
    await expect(page.locator('.version-stamp > .version')).toContainText('OAS 2.0');
  });

  test('should display OpenAPI 3.0.x', async ({ page }) => {
    // Load OpenAPI 3.0 example
    await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 3.0 Petstore');
    await waitForContentPropagation(page);

    await expect(
      page.locator('.title').filter({ hasText: 'Swagger Petstore - OpenAPI 3.0' })
    ).toBeVisible();
    await expect(page.locator('.version-stamp > .version')).toBeVisible();
    await expect(page.locator('.version-stamp > .version')).toContainText('OAS 3.0');
  });

  test('should display OpenAPI 3.1.0', async ({ page }) => {
    // Load OpenAPI 3.1 example
    await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 3.1 Petstore');
    await waitForContentPropagation(page);

    await expect(
      page.locator('.title').filter({ hasText: 'Swagger Petstore - OpenAPI 3.1' })
    ).toBeVisible();
    await expect(page.locator('.version-stamp > .version')).toBeVisible();
    await expect(page.locator('.version-stamp > .version')).toContainText('OAS 3.1');
  });

  test('should be hidden if not OpenAPI', async ({ page }) => {
    // Load AsyncAPI example instead of OpenAPI
    await clickNestedMenuItem(page, 'File', 'Load Example', 'AsyncAPI 2.6 Petstore');
    await waitForContentPropagation(page);

    await expect(page.locator('.title')).not.toBeAttached();
    await expect(page.locator('text=Swagger Petstore')).not.toBeAttached();
  });
});

/**
 * Editor Preview Pane: JumpToPath for Schemas
 * Tests for clicking schema links in SwaggerUI to jump to editor location
 */
test.describe('Editor Preview Pane: JumpToPath for Schemas', () => {
  test.beforeEach(async ({ page }) => {
    await visitBlankPage(page);
    await prepareAsyncAPI(page);
    await prepareOasGenerator(page);
    await waitForSplashScreen(page);

    // Load OpenAPI 3.0 example
    await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 3.0 Petstore');
    await waitForContentPropagation(page);
  });

  test('should scroll the editor to the correct path for schemas', async ({ page }) => {
    // Verify Order is not in editor initially
    const orderInEditorInitial = page
      .locator('.view-lines.monaco-mouse-cursor-text > div > span > span:has-text("Order")')
      .first();
    await expect(orderInEditorInitial).not.toBeAttached();

    // Find and click the jump-to-path link for Order model
    const jumpToPath = page.locator('div[id="model-Order"]').locator('.models-jump-to-path span');
    await jumpToPath.scrollIntoViewIfNeeded();
    await expect(jumpToPath).toBeVisible({ timeout: 10000 });
    await jumpToPath.click({ force: true });

    // Verify Order is now in editor
    const orderInEditor = page
      .locator('.view-lines.monaco-mouse-cursor-text > div > span > span:has-text("Order")')
      .first();
    await expect(orderInEditor).toBeAttached({ timeout: 10000 });
  });
});

/**
 * Editor Preview Pane: JumpToPath for security definitions
 * Tests for clicking security definition links in SwaggerUI to jump to editor location
 */
test.describe('Editor Preview Pane: JumpToPath for security definitions', () => {
  test.beforeEach(async ({ page }) => {
    await visitBlankPage(page);
    await prepareAsyncAPI(page);
    await prepareOasGenerator(page);
    await waitForSplashScreen(page);

    // Load OpenAPI 3.0 example
    await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 3.0 Petstore');
    await waitForContentPropagation(page);
  });

  test('should close the authorization popup', async ({ page }) => {
    // Open authorization popup
    const authorizeButton = page.locator('button:has-text("Authorize")');
    await authorizeButton.click();
    await expect(page.locator('.modal-ux')).toBeAttached();

    // Find and click the jump-to-path link (parent of .view-line-link)
    const jumpToPath = page
      .locator('.auth-container')
      .first()
      .locator('.view-line-link')
      .locator('..');
    await jumpToPath.scrollIntoViewIfNeeded();
    await expect(jumpToPath).toBeVisible();
    await jumpToPath.click({ force: true });

    // Verify popup is closed
    await expect(page.locator('.modal-ux')).not.toBeAttached({ timeout: 10000 });
  });

  test('should scroll the editor to the correct path for security definitions', async ({
    page,
  }) => {
    // Verify petstore_auth is not in editor initially
    const petstoreAuthInitial = page
      .locator('.view-lines.monaco-mouse-cursor-text > div > span > span:has-text("petstore_auth")')
      .first();
    await expect(petstoreAuthInitial).not.toBeAttached();

    // Open authorization popup
    const authorizeButton = page.locator('button:has-text("Authorize")');
    await authorizeButton.click();

    // Find and click the jump-to-path link (parent of .view-line-link)
    const jumpToPath = page
      .locator('.auth-container')
      .first()
      .locator('.view-line-link')
      .locator('..');
    await jumpToPath.scrollIntoViewIfNeeded();
    await expect(jumpToPath).toBeVisible();
    await jumpToPath.click({ force: true });

    // Verify petstore_auth is now in editor
    const petstoreAuthInEditor = page
      .locator('.view-lines.monaco-mouse-cursor-text > div > span > span:has-text("petstore_auth")')
      .first();
    await expect(petstoreAuthInEditor).toBeAttached({ timeout: 10000 });
  });
});
