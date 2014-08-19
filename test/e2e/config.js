'use strict';

var config = {
  baseUrl: 'http://localhost:8282/',

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

  allScriptsTimeout: 50000,

  onPrepare: function () {
    if (process.env.TRAVIS_BUILD_NUMBER) {
      browser.sleep(10 * 1000);
    }
  }
};

if (process.env.TRAVIS_BUILD_NUMBER) {
  console.log('Adding SauceLabs specific attributes.');
  config.sauceUser = 'mohsen1';
  config.sauceKey = process.env.SAUCE_ACCESS_KEY;
}

exports.config = config;
