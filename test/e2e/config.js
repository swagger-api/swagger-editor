exports.config = {

  capabilities: {
    'browserName': 'chrome',
    chromeOptions: {
      args: ['--test-type']
    }
  },

  specs: ['specs/**/*test.js'],

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },

  allScriptsTimeout: 50000
};
