import { createSafeActionWrapper } from '../util/fn.js';

// eslint-disable-next-line import/prefer-default-export
export const dropFileSuccess = createSafeActionWrapper((oriAction, system) => ({ content }) => {
  const { editorActions, EditorContentOrigin } = system;

  editorActions.setContent(content, EditorContentOrigin.FileDrop);
});
