import EditorPane from './components/EditorPane/EditorPane.jsx';
import TextareaEditor from './components/TextareaEditor/TextareaEditor.jsx';
import EditorPaneBarTop from './components/EditorPaneBars/EditorPaneBarTop.jsx';
import EditorPaneBarRight from './components/EditorPaneBars/EditorPaneBarRight.jsx';
import EditorPaneBarBottom from './components/EditorPaneBars/EditorPaneBarBottom.jsx';
import EditorPaneBarLeft from './components/EditorPaneBars/EditorPaneBarLeft.jsx';
import { editorSetup, editorTearDown } from './actions.js';
import {
  editorSetup as wrapEditorSetup,
  editorTearDown as wrapEditorTearDown,
} from './wrap-actions.js';
import { makeUseEditorLifecycle } from './hooks.js';

const EditorTextareaPlugin = ({ getSystem }) => ({
  rootInjects: {
    useEditorLifecycle: makeUseEditorLifecycle(getSystem),
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
      },
      wrapActions: {
        editorSetup: wrapEditorSetup,
        editorTearDown: wrapEditorTearDown,
      },
    },
  },
});

export default EditorTextareaPlugin;
