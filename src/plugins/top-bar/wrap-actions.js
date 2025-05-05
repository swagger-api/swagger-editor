import createSafeActionWrapper from '../../utils/create-safe-action-wrapper.js';

export const importUrlSuccess = createSafeActionWrapper((oriAction, system) => ({ definition }) => {
  const { editorActions, EditorContentOrigin } = system;

  editorActions.setContent(definition, EditorContentOrigin.ImportUrl);
});

export const uploadFileSuccess = createSafeActionWrapper((oriAction, system) => ({ content }) => {
  const { editorActions, EditorContentOrigin } = system;

  editorActions.setContent(content, EditorContentOrigin.ImportFile);
});
