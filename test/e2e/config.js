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

if (process.env.TRAVIS) {
  config.sauceUser = process.env.SAUCE_USERNAME;
  config.sauceKey = process.env.SAUCE_ACCESS_KEY;
  config.capabilities['tunnel-identifier'] = process.env.TRAVIS_JOB_NUMBER;
  config.capabilities.build = process.env.TRAVIS_BUILD_NUMBER;
}

exports.config = config;
