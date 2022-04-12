const CONTENT_KEY = 'swagger-ide-content';
const { localStorage } = window;

const saveContentToStorage = (str) => {
  return localStorage.setItem(CONTENT_KEY, str);
};

export const updateSpec = (oriAction) => (specStr) => {
  oriAction(specStr);
  saveContentToStorage(specStr);
};

export const loadFromLocalStorage = (system) => {
  // setTimeout runs on the next tick
  setTimeout(() => {
    if (localStorage.getItem(CONTENT_KEY)) {
      system?.specActions?.updateSpec(localStorage.getItem(CONTENT_KEY), 'local-storage');
    }
  }, 0);
};

/**
 * when given a SwaggerUI config prop `url`,
 * before `download` of new specStr as specified by `url`,
 * check if active specStr already exists in localStorage
 */
export const download = (oriAction) => (specStr) => {
  if (!localStorage.getItem(CONTENT_KEY)) {
    oriAction(specStr);
  }
};
