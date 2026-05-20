import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import nodePolyfills from 'rollup-plugin-polyfill-node';

import { logger, sharedOnwarn } from '../shared.js';
import { inlineAllWasms } from '../plugins/inline-all-wasms.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Redirect 'fs' to the browser shim before nodePolyfills() stubs it to an empty
// module. @asyncapi/parser imports readFile from 'fs' (guarded by Node.js checks
// at runtime, but the named export must exist for the bundle to link correctly).
const fsShimPlugin = {
  name: 'fs-shim',
  enforce: 'pre',
  resolveId(id) {
    if (id === 'fs') return resolve(__dirname, '../../src/polyfills/fs-shim.js');
    return null;
  },
};

// Self-contained ESM workers — spawned with { type: 'module' } by the virtual
// constructor modules in rewrite-editor-worker-import.js. codeSplitting:false
// flattens the bundle to a single file with no external imports.
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
      formats: ['es'],
      fileName: () => 'apidom.worker.js',
    },
    outDir: 'dist/esm',
    sourcemap: true,
    emptyOutDir: false,
    codeSplitting: false,
    rollupOptions: {
      onwarn: sharedOnwarn,
    },
  },
});

export const asyncapiParserWorkerConfig = defineConfig({
  configFile: false,
  customLogger: logger,
  mode: 'production',
  publicDir: false,
  plugins: [fsShimPlugin, { ...nodePolyfills(), enforce: 'pre' }],

  build: {
    lib: {
      entry: resolve(
        __dirname,
        '../../src/plugins/editor-preview-asyncapi/worker/asyncapi-parser.worker.ts'
      ),
      formats: ['es'],
      fileName: () => 'asyncapi-parser.worker.js',
    },
    outDir: 'dist/esm',
    sourcemap: true,
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
      formats: ['es'],
      fileName: () => 'editor.worker.js',
    },
    outDir: 'dist/esm',
    sourcemap: true,
    emptyOutDir: false,
    codeSplitting: false,
    rollupOptions: {
      onwarn: sharedOnwarn,
    },
  },
});
