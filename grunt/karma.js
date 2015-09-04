'use strict';

module.exports = {
  unit: {
    configFile: 'test/unit/karma.conf.js',
    singleRun: true
  },
  main: {
    configFile: 'test/unit/karma.conf.js',
    singleRun: false,
    autoWatch: true
  }
};
