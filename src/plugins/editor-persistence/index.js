import { updateSpec, download } from './wrap-actions.js';
import { editorLocalStorage } from './root-injects.js';
import afterLoad from './after-load.js';

const EditorLocalStoragePlugin = () => {
  return {
    afterLoad,
    rootInjects: {
      editorLocalStorage,
    },
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
