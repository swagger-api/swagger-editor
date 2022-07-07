import createSafeActionWrapper from '../../utils/create-safe-action-wrapper.js';

export const detectContentTypeSuccess = createSafeActionWrapper(
  (oriAction, system) =>
    ({ content }) => {
      const { specActions, editorSelectors } = system;

      if (editorSelectors.selectIsContentTypeOpenAPI()) {
        specActions.updateSpec(content, 'swagger-editor');
      }
    }
);

export const previewUnmounted = createSafeActionWrapper((oriAction, system) => () => {
  system.specActions.updateSpec('', 'swagger-editor');
});
