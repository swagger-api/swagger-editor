import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import { logger, sharedOnwarn } from '../shared.js';
import { inlineAllWasms } from '../plugins/inline-all-wasms.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Self-contained ESM workers — spawned with { type: 'module' } by the virtual
// constructor modules in rewrite-editor-worker-import.js. codeSplitting:false
// flattens the bundle to a single file with no external imports.
export const apidomWorkerConfig = defineConfig({
  configFile: false,
  customLogger: logger,
  mode: 'production',
  plugins: [inlineAllWasms()],

  build: {
    lib: {
      entry: resolve(__dirname, '../../src/plugins/editor-monaco-language-apidom/language/apidom.worker.js'),
      formats: ['es'],
      fileName: () => 'apidom.worker.js',
    },
    outDir: 'dist/esm',
    sourcemap: false,
    emptyOutDir: false,
    codeSplitting: false,
    rollupOptions: {
      onwarn: sharedOnwarn,
    },
  },
});

export const editorWorkerConfig = defineConfig({
  configFile: false,
  customLogger: logger,
  mode: 'production',
  plugins: [],

  build: {
    lib: {
      entry: resolve(__dirname, '../../node_modules/monaco-editor/esm/vs/editor/editor.worker.js'),
      formats: ['es'],
      fileName: () => 'editor.worker.js',
    },
    outDir: 'dist/esm',
    sourcemap: false,
    emptyOutDir: false,
    codeSplitting: false,
    rollupOptions: {
      onwarn: sharedOnwarn,
    },
  },
});
