import AsyncAPIEditorPreviewPane from './components/AsyncAPIEditorPreviewPane.jsx';
import EditorPreviewPaneWrapper from './wrap-components/EditorPreviewPaneWrapper.jsx';
import { getIsOasOrAsyncApi2, shouldUpdateDefinitionLanguage } from './actions.js';

const EditorPreviewAsyncAPIPlugin = () => ({
  components: {
    AsyncAPIEditorPreviewPane,
  },
  wrapComponents: {
    EditorPreviewPane: EditorPreviewPaneWrapper,
  },
  statePlugins: {
    asyncapi: {
      actions: {
        getIsOasOrAsyncApi2,
        shouldUpdateDefinitionLanguage,
      },
    },
  },
});

export default EditorPreviewAsyncAPIPlugin;
