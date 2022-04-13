export const updateSpec = (oriAction, system) => (specStr) => {
  const { editorLocalStorage } = system;

  oriAction(specStr);
  editorLocalStorage.setThrottled(specStr);
};

/**
 * When given a SwaggerUI config prop `url`,
 * before `download` of new specStr as specified by `url`,
 * check if active specStr already exists in localStorage.
 */

export const download = (oriAction, system) => (specStr) => {
  const { editorLocalStorage } = system;

  if (!editorLocalStorage.has()) {
    oriAction(specStr);
  }
};
