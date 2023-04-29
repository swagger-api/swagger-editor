import EditorPane from './components/EditorPane/EditorPane.jsx';
import TextareaEditor from './components/TextareaEditor/TextareaEditor.jsx';
import EditorPaneBarTop from './components/EditorPaneBars/EditorPaneBarTop.jsx';
import EditorPaneBarRight from './components/EditorPaneBars/EditorPaneBarRight.jsx';
import EditorPaneBarBottom from './components/EditorPaneBars/EditorPaneBarBottom.jsx';
import EditorPaneBarLeft from './components/EditorPaneBars/EditorPaneBarLeft.jsx';
import { editorSetup, editorTearDown, setContent, clearContent } from './actions.js';
import { selectContent, selectId, selectEditor } from './selectors.js';
import reducers from './reducers.js';
import {
  editorSetup as editorSetupWrap,
  editorTearDown as editorTearDownWrap,
  setContentDebounced as setContentDebouncedWrap,
  updateSpec as updateSpecWrap,
  clearContent as clearContentWrap,
} from './wrap-actions.js';
import { makeUseEditorLifecycle, useElementResize } from './hooks.js';

const EditorTextareaPlugin = ({ getSystem }) => ({
  rootInjects: {
    useEditorLifecycle: makeUseEditorLifecycle(getSystem),
    useElementResize,
  },
  components: {
    EditorPane,
    EditorPaneBarTop,
    EditorPaneBarRight,
    EditorPaneBarBottom,
    EditorPaneBarLeft,
    Editor: TextareaEditor,
    TextareaEditor,
  },
  statePlugins: {
    editor: {
      actions: {
        editorSetup,
        editorTearDown,
        setContent,
        setContentDebounced: setContent,
        clearContent,
      },
      wrapActions: {
        editorSetup: editorSetupWrap,
        editorTearDown: editorTearDownWrap,
        setContentDebounced: setContentDebouncedWrap,
        clearContent: clearContentWrap,
      },
      selectors: {
        selectContent,
        selectId,
        selectEditor,
      },
      reducers,
    },
    spec: {
      wrapActions: {
        updateSpec: updateSpecWrap,
      },
    },
  },
});

export default EditorTextareaPlugin;
