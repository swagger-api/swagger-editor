import { defineConfig, createLogger } from 'vite';
import { resolve, dirname } from 'path';
import { readFileSync } from 'fs';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logger = createLogger();
const loggerWarn = logger.warn.bind(logger);
logger.warn = (msg, options) => {
  if (msg.includes('has been externalized for browser compatibility')) return;
  loggerWarn(msg, options);
};

const inlineTreeSitterWasm = () => {
  const wasmPath = resolve(__dirname, 'node_modules/web-tree-sitter/tree-sitter.wasm');
  const wasmBase64 = readFileSync(wasmPath).toString('base64');
  return {
    name: 'inline-tree-sitter-wasm',
    renderChunk(code) {
      // Inject Module['wasmBinary'] at emscripten's module init so getBinaryPromise()
      // returns the binary directly without calling fetch().
      // Two forms: pre-minification (typeof != "undefined") and post-minification (void 0).
      const updated = code.replace(
        /var Module\s*=\s*typeof Module\s*!=\s*["']undefined["']\s*\?\s*Module\s*:\s*\{\}/,
        (match) =>
          `${match};Module['wasmBinary']=new Uint8Array(atob("${wasmBase64}").split("").map(function(c){return c.charCodeAt(0)}))`
      );
      return updated !== code ? { code: updated } : null;
    },
  };
};

// All WASM imports (tree-sitter.wasm, tree-sitter-yaml.wasm, tree-sitter-json.wasm)
// are redirected to virtual module IDs that do NOT end with '.wasm' and export the
// binary as a Uint8Array. For grammar WASMs, Language.load() accepts Uint8Array
// directly. For tree-sitter.wasm, the imported value is unused — emscripten reads
// Module.wasmBinary (injected by inlineTreeSitterWasm) before any fetch occurs.
const WASM_INLINE_PREFIX = '\0wasm-inline:';
const inlineAllWasms = () => ({
  name: 'inline-all-wasms',
  enforce: 'pre',
  async resolveId(id, importer) {
    if (!id.endsWith('.wasm')) return null;
    const resolved = await this.resolve(id, importer, { skipSelf: true });
    if (!resolved) return null;
    // ':inline' suffix ensures the virtual id does NOT end with '.wasm'.
    return WASM_INLINE_PREFIX + resolved.id + ':inline';
  },
  load(id) {
    if (!id.startsWith(WASM_INLINE_PREFIX)) return null;
    const filePath = id.slice(WASM_INLINE_PREFIX.length, -':inline'.length);
    const wasmBase64 = readFileSync(filePath).toString('base64');
    return `const bytes=new Uint8Array(atob("${wasmBase64}").split("").map(function(c){return c.charCodeAt(0)}));export default bytes;`;
  },
});

const sharedOnwarn = (warning, warn) => {
  // Monaco VSCode API uses import.meta.url guarded by globalThis.location?.href — safe to ignore.
  if (warning.code === 'EMPTY_IMPORT_META') return;
  // web-tree-sitter uses direct eval internally — cannot be changed.
  if (warning.code === 'EVAL') return;
  warn(warning);
};

// Configuration for main bundle
export const mainConfig = defineConfig({
  configFile: false,
  customLogger: logger,
  mode: 'production',
  plugins: [react()],
  assetsInclude: ['**/*.wasm'],
  resolve: {
    alias: {
      plugins: resolve(__dirname, 'src/plugins'),
      presets: resolve(__dirname, 'src/presets'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/App.tsx'),
      name: 'SwaggerEditor',
      formats: ['umd'],
      fileName: () => 'swagger-editor.js',
    },
    outDir: 'dist/umd',
    sourcemap: false,
    emptyOutDir: true,
    cssCodeSplit: false,

    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        assetFileNames: 'swagger-editor.css',
      },
      plugins: [nodePolyfills()],
      onwarn: sharedOnwarn,
    },
  },
});

// Configuration for apidom worker
export const apidomWorkerConfig = defineConfig({
  configFile: false,
  customLogger: logger,
  mode: 'production',
  plugins: [inlineTreeSitterWasm(), inlineAllWasms()],
  assetsInclude: ['**/*.wasm'],
  build: {
    lib: {
      entry: resolve(
        __dirname,
        'src/plugins/editor-monaco-language-apidom/language/apidom.worker.js'
      ),
      formats: ['iife'],
      fileName: () => 'apidom.worker.js',
      name: 'apidomWorker',
    },
    outDir: 'dist/umd',
    sourcemap: false,
    emptyOutDir: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
      onwarn: sharedOnwarn,
    },
  },
});

// Configuration for editor worker
export const editorWorkerConfig = defineConfig({
  configFile: false,
  customLogger: logger,
  mode: 'production',
  plugins: [],
  assetsInclude: ['**/*.wasm'],
  build: {
    lib: {
      entry: resolve(__dirname, 'node_modules/monaco-editor/esm/vs/editor/editor.worker.js'),
      formats: ['iife'],
      fileName: () => 'editor.worker.js',
      name: 'editorWorker',
    },
    outDir: 'dist/umd',
    sourcemap: false,
    emptyOutDir: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
      onwarn: sharedOnwarn,
    },
  },
});
