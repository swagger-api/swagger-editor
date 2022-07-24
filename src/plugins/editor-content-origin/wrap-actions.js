import createSafeActionWrapper from '../../utils/create-safe-action-wrapper.js';

// eslint-disable-next-line import/prefer-default-export
export const setContent = createSafeActionWrapper(
  (oriAction, system) => (content, contentOrigin) => {
    const { editorActions } = system;

    editorActions.setContentOrigin(contentOrigin);
  }
);
