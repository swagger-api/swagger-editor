import EditorPane from './components/EditorPane.jsx';
import MonacoEditorContainer from './components/MonacoEditorContainer.jsx';
import ValidationPane from './components/ValidationPane/ValidationPane.jsx';
import ThemeSelectionIcon from './components/ThemeSelectionIcon.jsx';
import {
  updateEditorTheme,
  updateEditorMarkers,
  setJumpToEditorMarker,
  clearJumpToEditorMarker,
} from './actions.js';
import reducers from './reducers.js';
import { getEditorTheme, getEditorMarkers, getEditorJumpToMarker } from './selectors.js';

const EditorMonacoPlugin = () => ({
  components: {
    MonacoEditor: MonacoEditorContainer,
    ValidationPane,
    ThemeSelection: ThemeSelectionIcon,
    EditorPane,
  },
  statePlugins: {
    editor: {
      actions: {
        updateEditorTheme,
        updateEditorMarkers,
        setJumpToEditorMarker,
        clearJumpToEditorMarker,
      },
      reducers,
      selectors: {
        getEditorTheme,
        getEditorMarkers,
        getEditorJumpToMarker,
      },
    },
  },
});

export default EditorMonacoPlugin;
