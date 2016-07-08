// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

var path = require("path");

var webpackConfig = require('../../webpack.config.js');

module.exports = function(config) {
  config.set({

    // Define a proxy to allow worker files served at correct path
    proxies: {},

    // base path, that will be used to resolve files and exclude
    basePath: '.',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['mocha', 'sinon-chai', 'chai', 'chai-as-promised'],

    // list of files / patterns to load in the browser
    files: [
      'index.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // Process test fies with webpack so require statements work in them
    preprocessors: {
      'index.js': ['webpack', 'sourcemap']
    },

    // Use a better looking test reporter
    reporters: ['mocha'],

    // enable webpack
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: webpackConfig.module.loaders
      },
      resolve: {
        root: [
          __dirname,
          path.join(__dirname, '../../')
        ]
      }
    },

    // Configuarion of webpackMiddleware
    webpackMiddleware: {
      quiet: true,
      progress: true,
      noInfo: true
    },

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN ||
    // LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_WARN,

    // enable / disable watching file and executing tests whenever any file
    // changes
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
