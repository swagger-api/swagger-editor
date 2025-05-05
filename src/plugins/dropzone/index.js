import Dropzone from './components/Dropzone.jsx';
import { makeUseDropzone } from './hooks.js';
import { dropFile, dropFileStarted, dropFileSuccess, dropFileFailure } from './actions.js';
import { dropFileSuccess as dropFileSuccessWrap } from './wrap-actions.js';

const DropzonePlugin = ({ getSystem }) => ({
  rootInjects: {
    useDropzone: makeUseDropzone(getSystem),
  },
  components: {
    Dropzone,
  },
  statePlugins: {
    editorDropzone: {
      actions: {
        dropFile,
        dropFileStarted,
        dropFileSuccess,
        dropFileFailure,
      },
      wrapActions: {
        dropFileSuccess: dropFileSuccessWrap,
      },
    },
  },
});

export default DropzonePlugin;
