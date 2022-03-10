import reducers from './reducers.js';
import { updateEditorIsReadOnly } from './actions.js';
import { selectEditorIsReadyOnly } from './selectors.js';
import ReadOnlySelectionIcon from './components/ReadOnlySelectionIcon.jsx';
import EditorPaneTopBarWrapper from './wrap-components/EditorPaneTopBarWrapper.jsx';
import EditorPaneWrapper from './wrap-components/EditorPaneWrapper.jsx';

const EditorReadOnlyPlugin = () => {
  return {
    components: {
      ReadOnlySelection: ReadOnlySelectionIcon,
    },
    wrapComponents: {
      EditorPane: EditorPaneWrapper,
      EditorPaneTopBar: EditorPaneTopBarWrapper,
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
