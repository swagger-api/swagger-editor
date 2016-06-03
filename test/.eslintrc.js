'use strict';

module.exports = {
  extends: '../.eslintrc.js',
  globals: {
    sinon: false,
    inject: false
  },
  env: {
    jasmine: true,
    mocha: true,
  },
  plugins: [
    'chai-expect'
  ],
  rules: {
    'chai-expect/missing-assertion': 2,
    'chai-expect/terminating-properties': 1,
    'no-unused-expressions': 0
  }
};
