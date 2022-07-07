import createSafeActionWrapper from '../../utils/create-safe-action-wrapper.js';

export const setContent = createSafeActionWrapper((oriAction, system) => (content) => {
  const { editorContentPersistence } = system;

  editorContentPersistence.set(content);
});

/**
 * When given a SwaggerUI config prop `url`,
 * before `download` of new content as specified by `url`,
 * check if active content already exists in localStorage.
 */

export const download = (oriAction, system) => (content) => {
  const { editorContentPersistence } = system;

  if (!editorContentPersistence.has()) {
    oriAction(content);
  }
};
