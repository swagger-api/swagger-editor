'use strict';

var PORT = 8282;
var startServer = require('../../server');

var config = {
  beforeLaunch: function() {
    startServer(PORT, function(err) {
      if (err) {
        return console.log(err);
      }

      console.log('Test server started at http://127.0.0.1:' + PORT);
    });
  },

  baseUrl: 'http://127.0.0.1:' + PORT + '/',

  capabilities: {
    browserName: 'chrome',
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
