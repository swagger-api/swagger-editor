import * as monaco from 'monaco-editor';

import MonacoEditorContainer from './components/MonacoEditor/MonacoEditorContainer.jsx';
import ValidationPane from './components/ValidationPane/ValidationPane.jsx';
import ThemeSelectionIcon from './components/ThemeSelectionIcon.jsx';
import EditorPaneBarTopWrapper from './wrap-components/EditorPaneBarTopWrapper.jsx';
import EditorPaneBarBottomWrapper from './wrap-components/EditorPaneBarBottomWrapper.jsx';
import {
  updateEditorTheme,
  setMarkers,
  setLanguage,
  appendMarkers,
  clearMarkers,
  setJumpToEditorMarker,
  clearJumpToEditorMarker,
  setRequestJumpToEditorMarker,
  clearRequestJumpToEditorMarker,
} from './actions.js';
import reducers from './reducers.js';
import {
  selectEditorTheme,
  selectMarkers,
  selectEditorJumpToMarker,
  selectEditorRequestJumpToMarker,
  selectLanguage,
} from './selectors.js';
import afterLoad from './after-load.js';

const EditorMonacoPlugin = () => ({
  afterLoad,
  rootInjects: {
    monaco,
  },
  components: {
    Editor: MonacoEditorContainer,
    MonacoEditor: MonacoEditorContainer,
    ValidationPane,
    ThemeSelection: ThemeSelectionIcon,
  },
  wrapComponents: {
    EditorPaneBarTop: EditorPaneBarTopWrapper,
    EditorPaneBarBottom: EditorPaneBarBottomWrapper,
  },
  statePlugins: {
    editor: {
      actions: {
        updateEditorTheme,
        setMarkers,
        appendMarkers,
        clearMarkers,
        setJumpToEditorMarker,
        clearJumpToEditorMarker,
        setRequestJumpToEditorMarker,
        clearRequestJumpToEditorMarker,
        setLanguage,
      },
      reducers,
      selectors: {
        selectEditorTheme,
        selectMarkers,
        selectEditorJumpToMarker,
        selectEditorRequestJumpToMarker,
        selectLanguage,
      },
    },
  },
});

export default EditorMonacoPlugin;
