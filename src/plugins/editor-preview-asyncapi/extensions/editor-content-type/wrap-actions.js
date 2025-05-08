import { createSafeActionWrapper } from '../../../util/fn.js';

// eslint-disable-next-line import/prefer-default-export
export const detectContentTypeSuccess = createSafeActionWrapper(
  (oriAction, system) =>
    ({ content }) => {
      const { editorSelectors, editorPreviewAsyncAPIActions } = system;

      if (editorSelectors.selectIsContentTypeAsyncAPI()) {
        editorPreviewAsyncAPIActions.parse(content);
      }
    }
);
