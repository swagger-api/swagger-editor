import { Page, Locator } from '@playwright/test';

/**
 * Editor Helpers - Monaco Editor interactions
 * Converted from Cypress custom commands to Playwright helpers
 * All helpers interact with window.monaco API exposed by Monaco Editor
 */

/**
 * Type definitions for Monaco window API
 */
interface MonacoWindow extends Window {
  monaco: {
    setPosition(position: { lineNumber: number; column: number }, source: string): void;
    focus(): void;
    setSelection(selection: {
      startLineNumber: number;
      startColumn: number;
      endLineNumber: number;
      endColumn: number;
    }): void;
    executeEdits(
      source: string,
      edits: Array<{
        range: {
          startLineNumber: number;
          startColumn: number;
          endLineNumber: number;
          endColumn: number;
        };
        text: string;
        forceMoveMarkers: boolean;
      }>
    ): void;
    trigger(source: string, action: string, data: any): void;
    getModel(): {
      getValue(): string;
    };
    getRawOptions(): {
      readOnly: boolean;
    };
  };
}

/**
 * Focus editor at specific position (defaults to line 1, column 1)
 * Cypress equivalent: cy.focusEditorText(position)
 */
export async function focusEditorText(
  page: Page,
  position: { lineNumber: number; column: number } = { lineNumber: 1, column: 1 }
): Promise<void> {
  await page.evaluate((pos) => {
    (window as unknown as MonacoWindow).monaco.setPosition(pos, 'mouse');
    (window as unknown as MonacoWindow).monaco.focus();
  }, position);
}

/**
 * Select text range in editor
 * Cypress equivalent: cy.selectEditorText(selection)
 */
export async function selectEditorText(
  page: Page,
  selection: {
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
  } = { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 }
): Promise<void> {
  await page.evaluate((sel) => {
    (window as unknown as MonacoWindow).monaco.setSelection(sel);
    (window as unknown as MonacoWindow).monaco.focus();
  }, selection);
}

/**
 * Type text in editor
 * Can optionally specify a range to replace
 * Cypress equivalent: cy.typeInEditor(text, options)
 */
export async function typeInEditor(
  page: Page,
  text: string,
  options?: {
    range?: {
      startLineNumber: number;
      startColumn: number;
      endLineNumber: number;
      endColumn: number;
    };
  }
): Promise<void> {
  if (options?.range) {
    await page.evaluate(
      ({ text: t, range }) => {
        (window as unknown as MonacoWindow).monaco.executeEdits('', [
          {
            range,
            text: t,
            forceMoveMarkers: true,
          },
        ]);
      },
      { text, range: options.range }
    );
  } else {
    await page.evaluate((t) => {
      (window as unknown as MonacoWindow).monaco.trigger('keyboard', 'type', { text: t });
    }, text);
  }
}

/**
 * Press backspace in editor
 * Cypress equivalent: cy.typeBackspaceInEditor()
 */
export async function typeBackspaceInEditor(page: Page): Promise<void> {
  await page.evaluate(() => {
    (window as unknown as MonacoWindow).monaco.trigger('keyboard', 'deleteLeft', null);
  });
}

/**
 * Select all text in editor (Ctrl+A / Cmd+A)
 * Cypress equivalent: cy.selectAllEditorText()
 */
export async function selectAllEditorText(page: Page): Promise<void> {
  await focusEditorText(page);
  const isMac = process.platform === 'darwin';
  const modifier = isMac ? 'Meta' : 'Control';
  await page.locator('.monaco-editor').press(`${modifier}+KeyA`);
}

/**
 * Get all text from editor
 * Cypress equivalent: cy.getAllEditorText()
 */
export async function getAllEditorText(page: Page): Promise<string> {
  return page.evaluate(() => {
    return (window as unknown as MonacoWindow).monaco.getModel().getValue();
  });
}

/**
 * Check if editor is in read-only mode
 * Cypress equivalent: cy.selectIsEditorReadOnly()
 */
export async function isEditorReadOnly(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    return (window as unknown as MonacoWindow).monaco.getRawOptions().readOnly;
  });
}

/**
 * Paste text to editor using clipboard API
 * Cypress equivalent: cy.pasteToEditor(text)
 */
export async function pasteToEditor(page: Page, text: string): Promise<void> {
  // Dispatch paste event exactly like Cypress does
  await page.locator('.monaco-editor').evaluate((element, data) => {
    const clipboardData = new DataTransfer();
    clipboardData.setData('text', data);
    const pasteEvent = new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      clipboardData,
    });
    // Add data property for compatibility
    (pasteEvent as any).data = data;

    element.dispatchEvent(pasteEvent);
  }, text);

  // Wait for paste to be processed
  await page.waitForTimeout(300);
}

/**
 * Get the Monaco editor locator
 * Useful for chaining other Playwright actions
 */
export function getEditorLocator(page: Page): Locator {
  return page.locator('.monaco-editor');
}
