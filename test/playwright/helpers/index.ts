/**
 * Playwright Test Helpers
 * Central export point for all helper modules
 */

// Setup helpers
export {
  visitBlankPage,
  waitForSplashScreen,
  waitForContentPropagation,
  prepareAsyncAPI,
  prepareOpenAPI30x,
  prepareOpenAPI20,
  prepareOasGenerator,
  clearDownloadsFolder,
} from './setup-helpers';

// Editor helpers
export {
  focusEditorText,
  selectEditorText,
  typeInEditor,
  typeBackspaceInEditor,
  selectAllEditorText,
  getAllEditorText,
  isEditorReadOnly,
  pasteToEditor,
  getEditorLocator,
  type MonacoWindow,
} from './editor-helpers';

// Menu helpers
export {
  clickMenu,
  clickNestedMenuItem,
  loadExample,
  clearEditor,
  convertToOpenAPI3,
  generateServer,
  generateClient,
  waitForMenu,
  isMenuVisible,
} from './menu-helpers';
