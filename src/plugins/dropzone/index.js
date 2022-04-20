import Dropzone from './components/Dropzone.jsx';
import { makeUseDropzone } from './hooks.js';

const DropzonePlugin = ({ getSystem }) => ({
  rootInjects: {
    useDropzone: makeUseDropzone(getSystem),
  },
  components: {
    Dropzone,
  },
});

export default DropzonePlugin;
