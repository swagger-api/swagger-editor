import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import nodePolyfills from 'rollup-plugin-polyfill-node';

import { logger, sharedOnwarn } from '../shared.js';
import { inlineAllWasms } from '../plugins/inline-all-wasms.js';
import { fsShim } from '../plugins/fs-shim.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const apidomWorkerConfig = defineConfig({
  configFile: false,
  customLogger: logger,
  mode: 'production',
  publicDir: false,
  plugins: [inlineAllWasms()],

  build: {
    lib: {
      entry: resolve(
        __dirname,
        '../../src/plugins/editor-monaco-language-apidom/language/apidom.worker.js'
      ),
      formats: ['iife'],
      fileName: () => 'apidom.worker.js',
      name: 'apidomWorker',
    },
    outDir: 'dist/umd',
    sourcemap: false,
    emptyOutDir: false,
    codeSplitting: false,
    rollupOptions: {
      plugins: [nodePolyfills()],
      onwarn: sharedOnwarn,
    },
  },
});

export const asyncapiParserWorkerConfig = defineConfig({
  configFile: false,
  customLogger: logger,
  mode: 'production',
  publicDir: false,
  plugins: [fsShim(), { ...nodePolyfills(), enforce: 'pre' }],

  build: {
    lib: {
      entry: resolve(
        __dirname,
        '../../src/plugins/editor-preview-asyncapi/worker/asyncapi-parser.worker.ts'
      ),
      formats: ['iife'],
      fileName: () => 'asyncapi-parser.worker.js',
      name: 'asyncapiParserWorker',
    },
    outDir: 'dist/umd',
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
  publicDir: false,
  plugins: [],

  build: {
    lib: {
      entry: resolve(__dirname, '../../node_modules/monaco-editor/esm/vs/editor/editor.worker.js'),
      formats: ['iife'],
      fileName: () => 'editor.worker.js',
      name: 'editorWorker',
    },
    outDir: 'dist/umd',
    sourcemap: false,
    emptyOutDir: false,
    codeSplitting: false,
    rollupOptions: {
      onwarn: sharedOnwarn,
    },
  },
});
