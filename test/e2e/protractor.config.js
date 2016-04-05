'use strict';

var PORT = 3032;
var exec = require('child_process').exec;
var path = require('path');
var server = null;

var config = {
  beforeLaunch: function() {
    console.log('Starting web server at port', PORT);

    server = exec('node server.js', {
      cwd: path.resolve(__dirname, '../..'),
      env: {
        PORT: PORT
      }
    });
  },

  afterLaunch: function() {
    console.log('Killing the web server at port ', PORT);

    if (server) {
      server.kill('SIGHUP');
    }

    return Promise.resolve();
  },

  baseUrl: 'http://127.0.0.1:' + PORT + '/',

  capabilities: {
    browserName: 'chrome', // process.env.TRAVIS ? 'firefox' : 'chrome',
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
