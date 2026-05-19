import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setupTests.js'],
    include: ['src/**/__tests__/**/*.{js,jsx,ts,tsx}', 'src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: ['**/*.d.ts'],
    },
    mockReset: true,
    css: false,
    server: {
      deps: {
        inline: ['@codingame/monaco-vscode-api'],
      },
    },
  },
  resolve: {
    alias: {
      src: `${import.meta.dirname}/src`,
      '@codingame/monaco-vscode-api/vscode/vs/base/common/strings':
        '@codingame/monaco-vscode-api/vscode/src/vs/base/common/strings.js',
      '@codingame/monaco-vscode-api/vscode/vs/editor/common/diff/defaultLinesDiffComputer/defaultLinesDiffComputer':
        '@codingame/monaco-vscode-api/vscode/src/vs/editor/common/diff/defaultLinesDiffComputer/defaultLinesDiffComputer.js',
    },
  },
});
