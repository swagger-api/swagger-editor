import EditorPreviewAsyncAPI from './components/EditorPreviewAsyncAPI/EditorPreviewAsyncAPI.jsx';
import AsyncAPIReactComponent from './components/AsyncAPIReactComponent.jsx';
import ParseErrors from './components/ParseErrors/ParseErrors.jsx';
import EditorPreviewWrapper from './extensions/editor-preview/wrap-components/EditorPreviewWrapper.jsx';
import { previewUnmounted, parse, parseStarted, parseSuccess, parseFailure } from './actions.js';
import { detectContentTypeSuccess as detectContentTypeSuccessWrap } from './extensions/editor-content-type/wrap-actions.js';
import reducers from './reducers.js';
import {
  selectParseStatus,
  selectIsParseInProgress,
  selectIsParseSuccess,
  selectIsParseFailure,
  selectParseResult,
  selectParseErrors,
  selectParseMarkers,
} from './selectors.js';
import afterLoad from './after-load.js';

const EditorPreviewAsyncAPIPlugin = () => ({
  afterLoad,
  components: {
    EditorPreviewAsyncAPI,
    EditorPreviewAsyncAPIParseErrors: ParseErrors,
    EditorPreviewAsyncAPIReactComponent: AsyncAPIReactComponent,
  },
  wrapComponents: {
    EditorPreview: EditorPreviewWrapper,
  },
  statePlugins: {
    editor: {
      wrapActions: {
        detectContentTypeSuccess: detectContentTypeSuccessWrap,
      },
    },
    editorPreviewAsyncAPI: {
      actions: {
        previewUnmounted,
        parse,
        parseStarted,
        parseSuccess,
        parseFailure,
      },
      selectors: {
        selectParseStatus,
        selectIsParseInProgress,
        selectIsParseSuccess,
        selectIsParseFailure,
        selectParseResult,
        selectParseErrors,
        selectParseMarkers,
      },
      reducers,
    },
  },
});

export default EditorPreviewAsyncAPIPlugin;
