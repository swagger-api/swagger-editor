import EditorPane from './components/EditorPane.jsx';
import {
  updateEditorTheme,
  updateEditorMarkers,
  setJumpToEditorMarker,
  clearJumpToEditorMarker,
} from './actions.js';
import reducers from './reducers.js';
import { getEditorTheme, getEditorMarkers, getEditorJumpToMarker } from './selectors.js';

const monacoEditorPlugin = () => {
  return {
    components: {
      EditorPane,
    },
    wrapComponents: {
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
  };
};

// load into swagger-ui as a 'preset' collection of plugins
export default function monacoEditorPreset() {
  return [monacoEditorPlugin];
}
