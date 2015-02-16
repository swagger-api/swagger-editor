'use strict';

var config = {
  baseUrl: 'http://localhost:8282/',

  capabilities: {
    browserName: process.env.TRAVIS ? 'firefox' : 'chrome',
    chromeOptions: {
      args: ['--test-type']
    }
  },

  onPrepare: function () {
    // The require statement must be down here, since jasmine-reporters
    // needs jasmine to be in the global and protractor does not guarantee
    // this until inside the onPrepare function.
    var jasmineReporter = require('jasmine-reporters');
    jasmine.getEnv().addReporter(new jasmineReporter.TapReporter());
  },

  specs: ['specs/**/*test.js'],

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },

  allScriptsTimeout: 50000
};

exports.config = config;
