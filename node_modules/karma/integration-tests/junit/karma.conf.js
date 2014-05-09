module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],

    files: [
      '*.js'
    ],

    browsers: ['Firefox'],

    reporters: ['dots', 'junit'],

    junitReporter: {
      outputFile: 'test-results.xml'
    }
  });
};
