'use strict';

module.exports = {
  extends: "../.eslintrc.js",
  globals: {
    sinon: true,
    inject: true,
    window: true
  },
  env: {
    jasmine: true,
    mocha: true
  }
};
