'use strict';

var config = {
  baseUrl: 'http://localhost:8282/',

  capabilities: {
    browserName: process.env.TRAVIS ? 'firefox' : 'chrome',
    chromeOptions: {
      args: ['--test-type']
    }
  },

  // To test specific files you can limit the spec files to steps 1, 2 and the
  // step you are looking for. For example:
  //
  // specs: [
  // 'specs/**/1*test.js',
  // 'specs/**/2*test.js',
  // 'specs/**/5*test.js'
  // ],
  //
  specs: ['specs/**/*test.js'],

  jasmineNodeOpts: {
    showColors: true,
    isVerbose: true,
    realtimeFailure: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 30000
  },

  allScriptsTimeout: 50000
};

exports.config = config;
