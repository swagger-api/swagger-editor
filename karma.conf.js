// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['mocha', 'sinon-chai'],

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/ace-builds/src-noconflict/ace.js',
      'app/bower_components/ace-builds/src-noconflict/mode-yaml.js',
      'app/bower_components/ace-builds/src-noconflict/ext-language_tools.js',
      'app/bower_components/yaml-js/yaml.js',
      'app/bower_components/js-yaml/dist/js-yaml.js',
      'app/bower_components/jquery/dist/jquery.js',
      'app/bower_components/lodash/dist/lodash.js',
      'app/bower_components/es5-shim/es5-shim.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/json3/lib/json3.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/marked/lib/marked.js',
      'app/bower_components/angular-marked/angular-marked.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/ngstorage/ngStorage.js',
      'app/bower_components/angular-ui-ace/ui-ace.js',
      'app/bower_components/angular-ui-router/release/angular-ui-router.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'app/bower_components/json-formatter/dist/json-formatter.js',
      'app/bower_components/angular-ui-layout/ui-layout.js',
      'app/bower_components/json-schema-view/dist/json-schema-view.js',
      'app/bower_components/jjv/lib/jjv.js',
      'app/bower_components/spark-md5/spark-md5.js',
      'app/bower_components/traverse/traverse.js',
      'app/bower_components/swagger-tools/browser/swagger-tools.js',
      'app/scripts/*.js',
      'app/scripts/**/*.js',
      'test/unit/mock/**/*.js',
      'test/unit/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome',],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
