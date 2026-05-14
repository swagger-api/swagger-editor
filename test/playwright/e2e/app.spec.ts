import { test, expect } from '@playwright/test';

import {
  visitBlankPage,
  waitForSplashScreen,
  prepareOasGenerator,
  prepareOpenAPI30x,
  clickNestedMenuItem,
} from '../helpers';

/**
 * App - Basic application tests
 * Migrated from: test/cypress/e2e/app.cy.js
 */
test.describe('App', () => {
  test.beforeEach(async ({ page }) => {
    await visitBlankPage(page);
    await page.goto('/');
    await waitForSplashScreen(page);
  });

  test('should render the app', async ({ page }) => {
    // Picking a random element that should display, in this case the 'File' menu dropdown
    await expect(page.getByText('File', { exact: true })).toBeVisible();
  });
});

test.describe('App: queryConfigEnabled', () => {
  test.beforeEach(async ({ page }) => {
    await visitBlankPage(page);
    await prepareOasGenerator(page);
  });

  test('should load the URL passed through the query', async ({ page }) => {
    await prepareOpenAPI30x(page);
    await waitForSplashScreen(page);

    await expect(
      page.locator('.title').filter({ hasText: 'Swagger Petstore - OpenAPI 3.0' })
    ).toBeVisible();
  });

  test('should apply filter passed through the query', async ({ page }) => {
    await page.goto('/?filter=user');
    await waitForSplashScreen(page);

    // Wait for menu to be ready
    await page.waitForTimeout(500);

    // Load OpenAPI 3.0 Petstore example using the updated helper with proper waits
    await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 3.0 Petstore');

    // Verify filter is applied - user tag should exist, pet tag should not
    await expect(page.locator('.opblock-tag').filter({ hasText: 'user' })).toBeVisible();
    await expect(page.locator('.opblock-tag').filter({ hasText: 'pet' })).not.toBeVisible();
  });
});
