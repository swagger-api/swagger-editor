import * as monaco from 'monaco-editor-core';

import MonacoEditorContainer from './components/MonacoEditor/MonacoEditorContainer.jsx';
import ValidationPane from './components/ValidationPane/ValidationPane.jsx';
import ThemeSelectionIcon from './components/ThemeSelectionIcon.jsx';
import EditorPaneBarTopWrapper from './wrap-components/EditorPaneBarTopWrapper.jsx';
import EditorPaneBarBottomWrapper from './wrap-components/EditorPaneBarBottomWrapper.jsx';
import {
  updateEditorTheme,
  updateEditorMarkers,
  setJumpToEditorMarker,
  clearJumpToEditorMarker,
} from './actions.js';
import reducers from './reducers.js';
import { selectEditorTheme, selectEditorMarkers, selectEditorJumpToMarker } from './selectors.js';
import makeAfterLoad from './after-load.js';

const EditorMonacoPlugin = (opts = {}) => {
  const isCalledWithGetSystem = typeof opts.getSystem === 'function';
  const options = isCalledWithGetSystem ? {} : opts;
  const plugin = () => ({
    afterLoad: makeAfterLoad(options),
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

  return isCalledWithGetSystem ? plugin(opts) : plugin;
};

export default EditorMonacoPlugin;
