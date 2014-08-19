'use strict';

PhonicsApp.service('Storage', ['LocalStorage', 'Backend', 'defaults', Storage]);

/*
 * Determines if LocalStorage should be used for storage or a Backend
*/
function Storage(LocalStorage, Backend, defaults) {
  if (defaults.useBackendForStorage) {
    return Backend;
  }

  return LocalStorage;
}
