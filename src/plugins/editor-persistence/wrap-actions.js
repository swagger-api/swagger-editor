export const updateSpec = (oriAction, system) => (specStr) => {
  const { editorPersistence } = system;

  oriAction(specStr);
  editorPersistence.setThrottled(specStr);
};

/**
 * When given a SwaggerUI config prop `url`,
 * before `download` of new specStr as specified by `url`,
 * check if active specStr already exists in localStorage.
 */

export const download = (oriAction, system) => (specStr) => {
  const { editorPersistence } = system;

  if (!editorPersistence.has()) {
    oriAction(specStr);
  }
};
