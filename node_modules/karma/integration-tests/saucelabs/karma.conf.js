var TRAVIS_WITHOUT_SAUCE = process.env.TRAVIS_SECURE_ENV_VARS === 'false';

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],

    files: [
      '*.js'
    ],

    browsers: [TRAVIS_WITHOUT_SAUCE ? 'Firefox' : 'sl_chrome_linux'],

    reporters: ['dots'],

    sauceLabs: {
      testName: 'Karma integration tests: saucelabs',
      startConnect: true
    },

    customLaunchers: {
      sl_chrome_linux: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'linux'
      }
    }
  });
};
