module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'dojo'],

    files: [
      'main.js',

      {pattern: '*.js', included: false}
    ],

    reporters: ['dots'],

    browsers: ['Firefox']
  });
};
