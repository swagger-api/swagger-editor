import reducers from './reducers.js';
import { setContentReadOnly, setContentReadWrite } from './actions.js';
import { selectContentIsReadOnly, selectContentIsReadWrite } from './selectors.js';
import ReadOnlySelectionIcon from './components/ReadOnlySelectionIcon.jsx';
import EditorPaneBarTopWrapper from './extensions/editor-textarea/wrap-components/EditorPaneBarTopWrapper.jsx';
import EditorWrapper from './extensions/editor-textarea/wrap-components/EditorWrapper.jsx';

const EditorContentReadOnlyPlugin = () => {
  return {
    components: {
      ReadOnlySelection: ReadOnlySelectionIcon,
    },
    wrapComponents: {
      Editor: EditorWrapper,
      EditorPaneBarTop: EditorPaneBarTopWrapper,
    },
    statePlugins: {
      editor: {
        reducers,
        selectors: {
          selectContentIsReadOnly,
          selectContentIsReadWrite,
        },
        actions: {
          setContentReadOnly,
          setContentReadWrite,
        },
      },
    },
  };
};

export default EditorContentReadOnlyPlugin;
