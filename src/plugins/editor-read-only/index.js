import reducers from './reducers.js';
import { updateEditorIsReadOnly } from './actions.js';
import { selectEditorIsReadOnly } from './selectors.js';
import ReadOnlySelectionIcon from './components/ReadOnlySelectionIcon.jsx';
import EditorPaneBarTopWrapper from './wrap-components/EditorPaneBarTopWrapper.jsx';
import EditorWrapper from './wrap-components/EditorWrapper.jsx';

const EditorReadOnlyPlugin = () => {
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
          selectEditorIsReadOnly,
        },
        actions: {
          updateEditorIsReadOnly,
        },
      },
    },
  };
};

export default EditorReadOnlyPlugin;
