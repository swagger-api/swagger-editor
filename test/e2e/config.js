'use strict';

var config = {
  baseUrl: 'http://localhost:8282/',

  capabilities: {
    'browserName': 'firefox',// process.env.TRAVIS ? 'firefox' : 'chrome',
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


exports.config = config;
