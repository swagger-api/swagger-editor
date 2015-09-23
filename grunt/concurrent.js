'use strict';

module.exports = {
  server: [
    'copy:styles'
  ],
  test: [
    'copy:styles',
  ],
  dist: [
    'copy:ace',
    'copy:source_code_pro',
    'copy:styles'
  ]
};
