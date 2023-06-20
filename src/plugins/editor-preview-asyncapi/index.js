import EditorPreviewAsyncAPI from './components/EditorPreviewAsyncAPI/EditorPreviewAsyncAPI.jsx';
import ParseErrors from './components/ParseErrors/ParseErrors.jsx';
import EditorPreviewWrapper from './wrap-components/EditorPreviewWrapper.jsx';
import { previewUnmounted, parse, parseStarted, parseSuccess, parseFailure } from './actions.js';
import { detectContentTypeSuccess as detectContentTypeSuccessWrap } from './wrap-actions.js';
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
