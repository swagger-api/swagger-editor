const path = require('path');

module.exports = {
  rootDir: path.join(__dirname, '..', '..'),
  testEnvironment: 'jsdom',
  testMatch: ['**/test/unit/*.js', '**/test/unit/**/*.js'],
  setupFilesAfterEnv: ['<rootDir>/test/unit/setup.js'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/test/build-artifacts/',
    '<rootDir>/test/mocha/',
    '<rootDir>/test/unit/setup.js',
    '<rootDir>/test/unit/plugins/validate-semantic/validate-helper.js',
    '<rootDir>/test/unit/mocks/ace.js'
  ],
};
