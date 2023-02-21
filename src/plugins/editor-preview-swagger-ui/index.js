import EditorPreviewSwaggerUI from './components/EditorPreviewSwaggerUI.jsx';
import EditorPreviewWrapper from './wrap-components/EditorPreviewWrapper.jsx';
import { previewUnmounted } from './actions.js';
import {
  detectContentTypeSuccess as detectContentTypeSuccessWrap,
  previewUnmounted as previewUnmountedWrap,
} from './wrap-actions.js';

const EditorPreviewSwaggerUIPlugin = () => ({
  components: {
    EditorPreviewSwaggerUI,
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
      },
      wrapActions: {
        previewUnmounted: previewUnmountedWrap,
      },
    },
  },
});

export default EditorPreviewSwaggerUIPlugin;
