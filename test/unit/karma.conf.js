// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

var path = require('path');

var files = require('main-bower-files')({
    filter: /\.js$/,
    includeDev: true
  })
  .map(function (filePath) {

    // make paths relative
    return path.relative(path.join(__dirname, '../../app'), filePath);
  })
  .filter(function (filePath) {

    // angular-scenario is added in runner.html file already
    return !/angular\-scenario/.test(filePath);
  })
  .concat([

    // Worker files
    {pattern: 'bower_components/sway-worker/index.js', served: true},

    // App source Code
    'scripts/*.js',
    'scripts/**/*.js',

    // Test files
    '../test/unit/defaults.js',
    '../test/unit/bootstrap.js',
    '../test/unit/spec/**/*.js'
  ]);

module.exports = function (config) {
  config.set({

    // Define a proxy to allow worker files served at correct path
    proxies: {
      '/bower_components/sway-worker/index.js':
        '/base/bower_components/sway-worker/index.js'
    },

    // base path, that will be used to resolve files and exclude
    basePath: '../../app',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['mocha', 'sinon-chai', 'chai', 'chai-as-promised'],

    // list of files / patterns to load in the browser
    files: files,

    // list of files / patterns to exclude
    exclude: [
      'scripts/bootstrap.js',
      'scripts/enums/defaults'
    ],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN ||
    // LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file
    // changes
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    reporters: ['mocha']
  });
};
