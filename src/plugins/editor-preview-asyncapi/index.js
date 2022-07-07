import EditorPreviewAsyncAPI from './components/EditorPreviewAsyncAPI/EditorPreviewAsyncAPI.jsx';
import ParseErrors from './components/ParseErrrors/ParseErrors.jsx';
import EditorPreviewWrapper from './wrap-components/EditorPreviewWrapper.jsx';
import { previewUnmounted, parse, parseStarted, parseSuccess, parseFailure } from './actions.js';
import { detectContentTypeSuccess as detectContentTypeSuccessWrap } from './wrap-actions.js';
import reducers from './reducers.js';
import {
  selectParserMarkers,
  selectParseStatus,
  selectIsParseInProgress,
  selectIsParseSuccess,
  selectIsParseFailure,
  selectParseResult,
  selectParseErrors,
} from './selectors.js';

const EditorPreviewAsyncAPIPlugin = () => ({
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
        selectParserMarkers,
        selectParseStatus,
        selectIsParseInProgress,
        selectIsParseSuccess,
        selectIsParseFailure,
        selectParseResult,
        selectParseErrors,
      },
      reducers,
    },
  },
});

export default EditorPreviewAsyncAPIPlugin;
