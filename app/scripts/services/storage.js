'use strict';

/*
 * Determines if LocalStorage should be used for storage or a Backend
*/
PhonicsApp.service('Storage', function Storage(LocalStorage, Backend,
  defaults) {
  if (defaults.useBackendForStorage) {
    return Backend;
  }

  return LocalStorage;
});
