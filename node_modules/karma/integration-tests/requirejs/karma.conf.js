// Karma configuration
// Generated on Thu Jul 26 2012 14:35:23 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'requirejs'],

    files: [
      'test-main.js',
      {pattern: '*.js', included: false},
      {pattern: 'relative/*.js', included: false}
    ],

    reporters: ['dots'],

    browsers: ['Firefox']
  });
};
