import createSafeActionWrapper from '../../../../utils/create-safe-action-wrapper.js';

// eslint-disable-next-line import/prefer-default-export
export const detectContentTypeSuccess = createSafeActionWrapper(
  (oriAction, system) =>
    ({ content }) => {
      const { specActions, editorSelectors, editorPreviewSwaggerUISelectors, EditorContentOrigin } =
        system;

      const contentOrigin = editorSelectors.selectContentOrigin();

      // all content in editor was deleted
      if (contentOrigin === EditorContentOrigin.Editor && !content.trim()) {
        specActions.updateUrl('');
      }

      if (editorSelectors.selectIsContentTypeOpenAPI()) {
        if (contentOrigin === EditorContentOrigin.ImportUrl) {
          specActions.updateUrl(editorPreviewSwaggerUISelectors.selectURL());
        } else if (contentOrigin !== EditorContentOrigin.Editor) {
          specActions.updateUrl('');
        }

        specActions.updateSpec(content, EditorContentOrigin.Editor);
      }
    }
);
