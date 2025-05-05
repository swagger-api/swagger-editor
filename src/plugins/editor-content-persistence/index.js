import { setContent as setContentWrap } from './extensions/editor-textarea/wrap-actions.js';
import { editorContentPersistence } from './root-injects.js';
import afterLoad from './after-load.js';

const EditorContentPersistencePlugin = () => {
  return {
    afterLoad,
    rootInjects: {
      editorContentPersistence,
    },
    statePlugins: {
      editor: {
        wrapActions: {
          setContent: setContentWrap,
        },
      },
    },
  };
};

export default EditorContentPersistencePlugin;
