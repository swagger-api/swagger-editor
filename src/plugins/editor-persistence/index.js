import { updateSpec, download } from './wrap-actions.js';
import { editorPersistence } from './root-injects.js';
import afterLoad from './after-load.js';

const EditorLocalStoragePlugin = () => {
  return {
    afterLoad,
    rootInjects: {
      editorPersistence,
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
