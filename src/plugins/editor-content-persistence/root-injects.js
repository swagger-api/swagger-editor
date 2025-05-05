import {
  hasLocalStorage,
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage,
} from './layers/local-storage.js';

// eslint-disable-next-line import/prefer-default-export
export const editorContentPersistence = {
  has() {
    return hasLocalStorage();
  },
  set(value) {
    return saveToLocalStorage(value);
  },
  get() {
    return loadFromLocalStorage();
  },
  remove() {
    removeFromLocalStorage();
  },
};
