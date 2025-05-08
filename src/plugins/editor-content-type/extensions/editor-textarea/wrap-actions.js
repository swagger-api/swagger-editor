import { createSafeActionWrapper } from '../../../util/fn.js';

// eslint-disable-next-line import/prefer-default-export
export const setContent = createSafeActionWrapper((oriAction, system) => (content) => {
  const { editorActions } = system;

  editorActions.detectContentType(content, system);
});
