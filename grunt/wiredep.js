'use strict';

module.exports = {
  app: {
    src: [
      'app/index.html',
      'app/styles/main.less'
    ],
    fileTypes: {
      html: {
        replace: {
          js: '<script src="./{{filePath}}"></script>'
        }
      },
      less: {
        replace: {
          css: '@import (less) "{{filePath}}";'
        }
      }
    }
  }
};
