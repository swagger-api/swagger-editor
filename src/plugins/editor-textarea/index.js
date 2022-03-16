import EditorPane from './components/EditorPane/EditorPane.jsx';
import TextareaEditor from './components/TextareaEditor/TextareaEditor.jsx';
import EditorPaneBarTop from './components/EditorPaneBars/EditorPaneBarTop.jsx';
import EditorPaneBarRight from './components/EditorPaneBars/EditorPaneBarRight.jsx';
import EditorPaneBarBottom from './components/EditorPaneBars/EditorPaneBarBottom.jsx';
import EditorPaneBarLeft from './components/EditorPaneBars/EditorPaneBarLeft.jsx';

const EditorTextareaPlugin = () => ({
  components: {
    EditorPane,
    EditorPaneBarTop,
    EditorPaneBarRight,
    EditorPaneBarBottom,
    EditorPaneBarLeft,
    Editor: TextareaEditor,
    TextareaEditor,
  },
});

export default EditorTextareaPlugin;
