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
  config.sauceKey = process.env.SAUCE_ACCESS_KEY;
}

exports.config = config;
