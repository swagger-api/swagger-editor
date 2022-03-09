import reducers from './reducers.js';
import { updateEditorIsReadOnly } from './actions.js';
import { selectEditorIsReadyOnly } from './selectors.js';
import ReadOnlySelectionIcon from './components/ReadOnlySelectionIcon.jsx';
import EditorPaneTopBar from './components/EditorPaneTopBar.jsx';
import EditorPaneWrapper from './wrap-components/EditorPaneWrapper.jsx';

const EditorReadOnlyPlugin = () => {
  return {
    components: {
      ReadOnlySelection: ReadOnlySelectionIcon,
      EditorPaneTopBar,
    },
    wrapComponents: {
      EditorPane: EditorPaneWrapper,
    },
    statePlugins: {
      editor: {
        reducers,
        selectors: {
          selectEditorIsReadyOnly,
        },
        actions: {
          updateEditorIsReadOnly,
        },
      },
    },
  };
};

export default EditorReadOnlyPlugin;
