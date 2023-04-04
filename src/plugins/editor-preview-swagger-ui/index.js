import EditorPreviewSwaggerUI from './components/EditorPreviewSwaggerUI.jsx';
import JumpToPath from './components/JumpToPath.jsx';
import EditorPreviewWrapper from './wrap-components/EditorPreviewWrapper.jsx';
import { previewUnmounted } from './actions/preview-unmounted.js';
import {
  jumpToPath,
  jumpToPathStarted,
  jumpToPathSuccess,
  jumpToPathFailure,
} from './actions/jump-to-path.js';
import {
  detectContentTypeSuccess as detectContentTypeSuccessWrap,
  previewUnmounted as previewUnmountedWrap,
} from './wrap-actions.js';

const EditorPreviewSwaggerUIPlugin = () => ({
  components: {
    EditorPreviewSwaggerUI,
    JumpToPath,
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
      },
    },
  },
});

export default EditorPreviewSwaggerUIPlugin;
