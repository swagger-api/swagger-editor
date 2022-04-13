import {
  hasLocalStorage,
  saveToLocalStorage,
  saveToLocalStorageThrottled,
  loadFromLocalStorage,
} from './utils.js';

// eslint-disable-next-line import/prefer-default-export
export const editorLocalStorage = {
  has() {
    return hasLocalStorage();
  },
  set(value) {
    return saveToLocalStorage(value);
  },
  setThrottled(value) {
    return saveToLocalStorageThrottled(value);
  },
  get() {
    return loadFromLocalStorage();
  },
};
