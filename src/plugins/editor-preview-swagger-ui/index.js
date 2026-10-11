import EditorPreviewSwaggerUI from './components/EditorPreviewSwaggerUI/EditorPreviewSwaggerUI.jsx';
import JumpToPath from './components/JumpToPath.jsx';
import EditorPreviewWrapper from './extensions/editor-preview/wrap-components/EditorPreviewWrapper.jsx';
import RequestBodyWrapper from './components/RequestBodyWrapper.jsx';
import { previewUnmounted } from './actions/preview-unmounted.js';
import {
  jumpToPath,
  jumpToPathStarted,
  jumpToPathSuccess,
  jumpToPathFailure,
} from './actions/jump-to-path.js';
import {
  previewUnmounted as previewUnmountedWrap,
  jumpToPathSuccess as jumpToPathSuccessWrap,
} from './wrap-actions.js';
import { detectContentTypeSuccess as detectContentTypeSuccessWrap } from './extensions/editor-content-type/wrap-actions.js';
import reducers from './reducers.js';
import { selectURL } from './selectors.js';

const EditorPreviewSwaggerUIPlugin = () => ({
  components: {
    EditorPreviewSwaggerUI,
    JumpToPath,
  },
  wrapComponents: {
    EditorPreview: EditorPreviewWrapper,
    RequestBody: RequestBodyWrapper,
  },
  statePlugins: {
    editor: {
      wrapActions: {
        detectContentTypeSuccess: detectContentTypeSuccessWrap,
      },
    },
    editorPreviewSwaggerUI: {
      actions: {
        previewUnmounted,
        jumpToPath,
        jumpToPathStarted,
        jumpToPathSuccess,
        jumpToPathFailure,
      },
      wrapActions: {
        previewUnmounted: previewUnmountedWrap,
        jumpToPathSuccess: jumpToPathSuccessWrap,
      },
      selectors: { selectURL },
      reducers,
    },
  },
});

export default EditorPreviewSwaggerUIPlugin;
