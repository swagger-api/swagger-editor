import { Page } from '@playwright/test';

/**
 * Menu Helpers - Top bar menu navigation
 * Reusable patterns for interacting with dropdown menus
 */

/**
 * Click a top-level menu item (File, Edit, Generate, etc.)
 */
export async function clickMenu(page: Page, menuName: string): Promise<void> {
  await page.getByText(menuName, { exact: true }).click();
}

/**
 * Click a nested menu item (e.g., File > Load Example > Petstore OpenAPI 3.0)
 * Automatically handles hovering over intermediate menu items with proper waits
 *
 * @param page - Playwright page object
 * @param topMenu - Top-level menu name (e.g., "File")
 * @param subMenuItems - Array of submenu items to navigate through
 *
 * @example
 * // Click File > Load Example > Petstore OpenAPI 3.0
 * await clickNestedMenuItem(page, 'File', 'Load Example', 'Petstore OpenAPI 3.0');
 */
export async function clickNestedMenuItem(
  page: Page,
  topMenu: string,
  ...subMenuItems: string[]
): Promise<void> {
  // Click top-level menu and wait for it to be visible
  const topMenuItem = page.getByText(topMenu, { exact: true }).first();
  await topMenuItem.waitFor({ state: 'visible', timeout: 10000 });
  await topMenuItem.click();

  // Wait for menu to open
  await page.waitForTimeout(300);

  // Hover over intermediate menu items (all except the last one)
  for (let i = 0; i < subMenuItems.length - 1; i++) {
    // Use locator that finds visible menu items only
    // Don't use exact match because menu items may have arrows (">") appended
    const menuItem = page.getByText(subMenuItems[i]).first();
    // Wait for submenu item to be visible before hovering
    await menuItem.waitFor({ state: 'visible', timeout: 10000 });
    await menuItem.hover();
    // Small delay to allow submenu to fully open
    await page.waitForTimeout(300);
  }

  // Click the final menu item
  const lastItem = subMenuItems[subMenuItems.length - 1];
  // Don't use exact match because menu items may have arrows (">") appended
  const finalMenuItem = page.getByText(lastItem).first();
  await finalMenuItem.waitFor({ state: 'visible', timeout: 10000 });
  await finalMenuItem.click();
}

/**
 * Load an example file from File > Load Example menu
 * Common shortcut for test setup
 *
 * @param page - Playwright page object
 * @param exampleName - Name of the example to load (e.g., "Petstore OpenAPI 3.0")
 */
export async function loadExample(page: Page, exampleName: string): Promise<void> {
  await clickNestedMenuItem(page, 'File', 'Load Example', exampleName);
}

/**
 * Clear editor content via Edit > Clear Editor menu
 */
export async function clearEditor(page: Page): Promise<void> {
  await clickNestedMenuItem(page, 'Edit', 'Clear Editor');
}

/**
 * Convert to OpenAPI 3 via Edit > Convert to OpenAPI 3 menu
 */
export async function convertToOpenAPI3(page: Page): Promise<void> {
  await clickNestedMenuItem(page, 'Edit', 'Convert to OpenAPI 3');
}

/**
 * Generate server code via Generate > Server menu
 *
 * @param page - Playwright page object
 * @param serverName - Server generator name (e.g., "nodejs-server")
 */
export async function generateServer(page: Page, serverName: string): Promise<void> {
  await clickNestedMenuItem(page, 'Generate', 'Server', serverName);
}

/**
 * Generate client code via Generate > Client menu
 *
 * @param page - Playwright page object
 * @param clientName - Client generator name (e.g., "javascript")
 */
export async function generateClient(page: Page, clientName: string): Promise<void> {
  await clickNestedMenuItem(page, 'Generate', 'Client', clientName);
}

/**
 * Wait for a menu to be visible
 * Useful for assertions or waiting for dynamic content to load
 */
export async function waitForMenu(page: Page, menuName: string): Promise<void> {
  await page.getByText(menuName, { exact: true }).waitFor({ state: 'visible' });
}

/**
 * Check if a menu item is visible
 */
export async function isMenuVisible(page: Page, menuName: string): Promise<boolean> {
  return page.getByText(menuName, { exact: true }).isVisible();
}
