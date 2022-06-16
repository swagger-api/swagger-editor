import AsyncAPIEditorPreviewPane from './components/AsyncAPIEditorPreviewPane.jsx';
import EditorPreviewPaneWrapper from './wrap-components/EditorPreviewPaneWrapper.jsx';
import {
  getIsOasOrAsyncApi2,
  shouldUpdateDefinitionLanguage,
  updateAsyncApiParserMarkers,
} from './actions.js';
import reducers from './reducers.js';
import { selectAsyncApiParserMarkers } from './selectors.js';

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
        updateAsyncApiParserMarkers,
      },
      reducers,
      selectors: { selectAsyncApiParserMarkers },
    },
  },
});

export default EditorPreviewAsyncAPIPlugin;
