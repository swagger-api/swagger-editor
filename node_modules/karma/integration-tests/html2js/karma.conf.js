module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],

    files: [
      '*.js',
      '*.html'
    ],

    preprocessors: {
      '*.html': ['html2js']
    },

    browsers: ['Firefox'],

    reporters: ['dots']
  });
};
