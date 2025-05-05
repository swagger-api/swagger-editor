import TransformDialog from './components/TransformDialog.jsx';
import EditorWrapper from './extensions/editor-monaco/wrap-components/EditorWrapper.jsx';
import {
  closeTransformDialog,
  openTransformDialog,
  openTransformDialogStarted,
  openTransformDialogSuccess,
  openTransformDialogFailure,
  transformClipboardData,
  transformClipboardDataStarted,
  transformClipboardDataSuccess,
  transformClipboardDataFailure,
} from './actions.js';
import { selectClipboardData, selectIsTransformDialogOpen } from './selectors.js';
import reducers from './reducers.js';
import afterLoad from './after-load.js';

const EditorMonacoYamlPastePlugin = () => ({
  afterLoad,
  components: {
    EditorMonacoYAMLTransformDialog: TransformDialog,
  },
  wrapComponents: {
    Editor: EditorWrapper,
  },
  statePlugins: {
    editorMonacoYAMLPaste: {
      actions: {
        closeTransformDialog,
        openTransformDialog,
        openTransformDialogStarted,
        openTransformDialogSuccess,
        openTransformDialogFailure,
        transformClipboardData,
        transformClipboardDataStarted,
        transformClipboardDataSuccess,
        transformClipboardDataFailure,
      },
      selectors: {
        selectClipboardData,
        selectIsTransformDialogOpen,
      },
      reducers,
    },
  },
});

export default EditorMonacoYamlPastePlugin;
