import createSafeActionWrapper from '../../utils/create-safe-action-wrapper.js';

// eslint-disable-next-line import/prefer-default-export
export const detectContentTypeSuccess = createSafeActionWrapper(
  (oriAction, system) =>
    ({ content }) => {
      const { editorSelectors, editorPreviewAsyncAPIActions } = system;

      if (editorSelectors.selectIsContentTypeAsyncAPI2()) {
        editorPreviewAsyncAPIActions.parse(content);
      }
    }
);
