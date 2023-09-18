const path = require('path');

module.exports = {
  rootDir: path.join(__dirname, '..', '..'),
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/test/unit/jest-shim.js'],
  testMatch: ['**/test/build-artifacts/**/*.js'],
  transformIgnorePatterns: ['/node_modules/(?!(swagger-client|react-syntax-highlighter)/)'],
};
