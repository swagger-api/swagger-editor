'use strict';

module.exports = {
  main: {
    src: 'app/scripts/**/*.js',
    options: {
      config: '.jscsrc',
      requireCurlyBraces: [ 'if' ]
    }
  },

  test: {
    src: 'test/**/*.js',
    options: {
      config: 'test/.jscsrc',
      requireCurlyBraces: [ 'if' ]
    }
  }
};
