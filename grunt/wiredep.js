'use strict';

module.exports = {
  app: {
    src: [
      'app/index.html'
    ],
    fileTypes: {
      html: {
        replace: {
          js: '<script src="./{{filePath}}"></script>'
        }
      }
    }
  }
};
