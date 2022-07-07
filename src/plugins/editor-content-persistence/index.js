import { setContent as setContentWrap, download as downloadWrap } from './wrap-actions.js';
import { editorContentPersistence } from './root-injects.js';
import afterLoad from './after-load.js';

const EditorContentPersistencePlugin = () => {
  return {
    afterLoad,
    rootInjects: {
      editorContentPersistence,
    },
    statePlugins: {
      spec: {
        wrapActions: {
          download: downloadWrap,
        },
      },
      editor: {
        wrapActions: {
          setContent: setContentWrap,
        },
      },
    },
  };
};

export default EditorContentPersistencePlugin;
