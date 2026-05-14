export default {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.js'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\](?!@codingame/monaco-vscode-api[/\\\\]).+\\.(js|jsx|mjs|cjs|ts|tsx)$',
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.(css|scss|sass|less)$': '<rootDir>/src/__mocks__/fileMock.cjs',
    '^.+\\.(svg|png|jpg|jpeg|gif|woff|woff2|ttf|eot|ico)(\\?.*)?$':
      '<rootDir>/src/__mocks__/fileMock.cjs',
    '@codingame/monaco-vscode-api/vscode/vs/base/common/strings':
      '@codingame/monaco-vscode-api/vscode/src/vs/base/common/strings.js',
    '@codingame/monaco-vscode-api/vscode/vs/editor/common/diff/defaultLinesDiffComputer/defaultLinesDiffComputer':
      '@codingame/monaco-vscode-api/vscode/src/vs/editor/common/diff/defaultLinesDiffComputer/defaultLinesDiffComputer.js',
    '^src/(.*)$': '<rootDir>/src/$1',
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
