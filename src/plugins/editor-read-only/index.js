import reducers from './reducers.js';
import { updateEditorIsReadOnly } from './actions.js';
import { selectEditorIsReadyOnly } from './selectors.js';
import ReadOnlySelectionIcon from './components/ReadOnlySelectionIcon.jsx';
import EditorPaneTopBar from './components/EditorPaneTopBar.jsx';

const EditorReadOnlyPlugin = () => {
  return {
    components: {
      ReadOnlySelection: ReadOnlySelectionIcon,
      EditorPaneTopBar,
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
