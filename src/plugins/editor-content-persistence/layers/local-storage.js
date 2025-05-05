const STORAGE_KEY = 'swagger-editor-next-content';

export const saveToLocalStorage = (value) => {
  return localStorage.setItem(STORAGE_KEY, value);
};

export const loadFromLocalStorage = () => {
  return localStorage.getItem(STORAGE_KEY);
};

export const hasLocalStorage = () => {
  return loadFromLocalStorage() !== null;
};

export const removeFromLocalStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};
