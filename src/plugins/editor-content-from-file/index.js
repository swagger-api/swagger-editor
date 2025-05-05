import {
  importUrlSuccess as importUrlSuccessWrap,
  uploadFileSuccess as uploadFileSuccessWrap,
} from './extensions/top-bar/wrap-actions.js';
import { dropFileSuccess as dropFileSuccessWrap } from './extensions/dropzone/wrap-actions.js';

const EditorContentFromFilePlugin = () => {
  return {
    statePlugins: {
      editor: {
        wrapActions: {
          importUrlSuccess: importUrlSuccessWrap,
          uploadFileSuccess: uploadFileSuccessWrap,
        },
      },
      editorDropzone: {
        wrapActions: {
          dropFileSuccess: dropFileSuccessWrap,
        },
      },
    },
  };
};

export default EditorContentFromFilePlugin;
