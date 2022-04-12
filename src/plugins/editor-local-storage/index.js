import { updateSpec, loadFromLocalStorage, download } from './wrap-actions.js';

/**
 * wraps updateSpec to also save specStr to localStorage
 * wraps download to check if it should be ignored
 */

const EditorLocalStoragePlugin = (system) => {
  loadFromLocalStorage(system); // will check if exists
  return {
    statePlugins: {
      spec: {
        wrapActions: {
          updateSpec,
          download,
        },
      },
    },
  };
};

export default EditorLocalStoragePlugin;
