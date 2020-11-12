const unitConfig = require('./jest.unit.config');

module.exports = {
  ...unitConfig,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  coverageThreshold: {
    './src/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
