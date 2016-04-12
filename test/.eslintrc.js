'use strict';

module.exports = {
  extends: "../.eslintrc.js",
  globals: {
    sinon: false,
    inject: false
  },
  env: {
    jasmine: true,
    mocha: true
  }
};
