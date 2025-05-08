import { createSafeActionWrapper } from '../../../util/fn.js';

// eslint-disable-next-line import/prefer-default-export
export const detectContentTypeSuccess = createSafeActionWrapper(
  (oriAction, system) =>
    ({ content }) => {
      const { editorSelectors, editorPreviewADSActions } = system;

      if (editorSelectors.selectIsContentTypeAPIDesignSystems()) {
        const contentType = editorSelectors.selectContentType();
        const parserOptions = {};

        editorPreviewADSActions.parse({ content, contentType, parserOptions });
      }
    }
);
