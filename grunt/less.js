'use strict';

module.exports = {
  options: {
    paths: 'app/styles'
  },
  server: {
    files: {
      '.tmp/styles/main.css': 'app/styles/main.less'
    }
  }
};
