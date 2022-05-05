import * as monaco from 'monaco-editor-core';

import EditorPane from './components/EditorPane.jsx';
import MonacoEditorContainer from './components/MonacoEditorContainer.jsx';
import ValidationPane from './components/ValidationPane/ValidationPane.jsx';
import ThemeSelectionIcon from './components/ThemeSelectionIcon.jsx';
import EditorPaneBarTopWrapper from './wrap-components/EditorPaneBarTopWrapper.jsx';
import {
  updateEditorTheme,
  updateEditorMarkers,
  setJumpToEditorMarker,
  clearJumpToEditorMarker,
} from './actions.js';
import reducers from './reducers.js';
import { selectEditorTheme, selectEditorMarkers, selectEditorJumpToMarker } from './selectors.js';

const EditorMonacoPlugin = () => ({
  rootInjects: {
    monaco,
  },
  components: {
    Editor: MonacoEditorContainer,
    MonacoEditor: MonacoEditorContainer,
    ValidationPane,
    ThemeSelection: ThemeSelectionIcon,
    EditorPane,
  },
  wrapComponents: {
    EditorPaneBarTop: EditorPaneBarTopWrapper,
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
        selectEditorTheme,
        selectEditorMarkers,
        selectEditorJumpToMarker,
      },
    },
  },
});

export default EditorMonacoPlugin;
