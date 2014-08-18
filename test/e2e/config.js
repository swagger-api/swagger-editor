'use strict';

var config = {

  capabilities: {
    'browserName': 'chrome',
    chromeOptions: {
      args: ['--test-type']
    }
  },

  specs: ['specs/**/*test.js'],

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },

  allScriptsTimeout: 50000
};

if (process.env.TRAVIS_BUILD_NUMBER) {
  config.sauceUser = 'mohsen1';
  config.sauceKey = '3b58e66f-370c-4fb7-9161-a7b5de09cb0a';
}

exports.config = config;
