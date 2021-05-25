'use strict';

const path = require('path');

module.exports = {
  rootDir: path.join(__dirname, '..', '..'),
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  setupFiles: ['react-app-polyfill/jsdom'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  testEnvironment: 'jsdom',
  testRunner: path.join(__dirname, '..', '..', 'node_modules', 'jest-circus', 'runner.js'),
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)': '<rootDir>/config/jest/fileTransform.js',
  },
  transformIgnorePatterns: [
    // 'node_modules\/(?!(monaco-editor)\/)',
    '/node_modules/(?!monaco-editor).+\\.js$',
    // '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  modulePaths: [],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^monaco-editor$': '<rootDir>/test/__mocks__/monacoMock.js',
    '^monaco-editor-core$': '<rootDir>/test/__mocks__/monacoMock.js',
    // '^monaco-editor$': '<rootDir>/node_modules/monaco-editor/esm/vs/editor/editor.api.js',
    // '^monaco-editor$': '<rootDir>/node_modules/monaco-editor/esm/vs/editor/editor.main.js',
    // '^monaco-editor$': '<rootDir>/node_modules/monaco-editor/esm/vs/editor/editor.all.js',
    // '^monaco-editor$': '<rootDir>/node_modules/monaco-editor/esm/vs/editor/editor.api.d.ts',
  },
  moduleFileExtensions: [
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
    'node',
  ],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
  resetMocks: true,
};
