import throttle from 'lodash/throttle.js';

const STORAGE_KEY = 'swagger-ide-content';

export const saveToLocalStorage = (value) => {
  return localStorage.setItem(STORAGE_KEY, value);
};

export const saveToLocalStorageThrottled = throttle(saveToLocalStorage, 150);

export const loadFromLocalStorage = () => {
  return localStorage.getItem(STORAGE_KEY);
};

export const hasLocalStorage = () => {
  return loadFromLocalStorage() !== null;
};
