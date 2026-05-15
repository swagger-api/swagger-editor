import { defineConfig, createLogger } from 'vite';
import { resolve, dirname, relative } from 'path';
import { readFileSync } from 'fs';
import glob from 'glob';
import wasmPlugin from '@rollup/plugin-wasm';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logger = createLogger();
const loggerWarn = logger.warn.bind(logger);
logger.warn = (msg, options) => {
  if (msg.includes('has been externalized for browser compatibility')) return;
  loggerWarn(msg, options);
};

// web-tree-sitter's emscripten runtime fetches 'tree-sitter.wasm' via URL at
// runtime using its own locateFile mechanism, bypassing @rollup/plugin-wasm.
// This plugin patches the final IIFE output to replace every occurrence of the
// `tree-sitter.wasm` filename literal (any quote style) with a base64 data URI
// so emscripten's isDataURI() check short-circuits and no HTTP fetch is needed.
const inlineTreeSitterWasm = () => {
  const wasmPath = resolve(__dirname, 'node_modules/web-tree-sitter/tree-sitter.wasm');
  const wasmBase64 = readFileSync(wasmPath).toString('base64');
  return {
    name: 'inline-tree-sitter-wasm',
    renderChunk(code) {
      // Inject Module['wasmBinary'] at emscripten's module init so getBinaryPromise()
      // returns the binary directly without calling fetch() — this bypasses the broken
      // @rollup/plugin-wasm fetch interceptor whose endsWith() condition would otherwise
      // match the data URI against itself (a string always ends with itself).
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

// Grammar WASMs (tree-sitter-yaml.wasm, tree-sitter-json.wasm) are imported as
// ES modules in apidom's browser.mjs via `import treeSitterYaml from '*.wasm'`.
// @rollup/plugin-wasm converts these to async loader functions, but Language.load()
// only accepts URL strings or Uint8Arrays — not functions.
//
// This plugin intercepts grammar WASM imports by redirecting them to virtual module
// IDs that do NOT end with '.wasm', preventing @rollup/plugin-wasm's transform hook
// from firing (it checks id.endsWith('.wasm')). The virtual module exports a Uint8Array
// that Language.load() accepts directly.
const GRAMMAR_WASM_PREFIX = '\0grammar-wasm:';
const inlineGrammarWasms = () => ({
  name: 'inline-grammar-wasms',
  enforce: 'pre',
  async resolveId(id, importer) {
    if (!id.endsWith('.wasm') || id.includes('tree-sitter.wasm')) return null;
    const resolved = await this.resolve(id, importer, { skipSelf: true });
    if (!resolved) return null;
    // Append ':inline' so the virtual id does NOT end with '.wasm' —
    // @rollup/plugin-wasm checks id.endsWith('.wasm') in its transform hook.
    return GRAMMAR_WASM_PREFIX + resolved.id + ':inline';
  },
  load(id) {
    if (!id.startsWith(GRAMMAR_WASM_PREFIX)) return null;
    const filePath = id.slice(GRAMMAR_WASM_PREFIX.length, -':inline'.length);
    const wasmBase64 = readFileSync(filePath).toString('base64');
    return `const bytes=new Uint8Array(atob("${wasmBase64}").split("").map(function(c){return c.charCodeAt(0)}));export default bytes;`;
  },
});

const sharedOnwarn = (warning, warn) => {
  if (warning.code === 'EVAL') return;
  if (warning.code === 'EMPTY_IMPORT_META') return;
  warn(warning);
};

// ?worker is a Vite-only transform. Without enforce:'pre', Vite's built-in
// resolution runs first and externalizes the import with the absolute path +
// ?worker suffix baked into the output. With enforce:'pre' our resolveId runs
// first and swaps it for a virtual module.
// The URL is created on a separate line from new Worker() to avoid triggering
// vite:worker-import-meta-url's `new Worker(new URL(...))` pattern detector.
const rewriteEditorWorkerImport = () => ({
  name: 'rewrite-editor-worker-import',
  enforce: 'pre',
  resolveId(id) {
    if (id.endsWith('?worker')) {
      if (id.includes('editor.worker')) return '\0virtual:editor-worker-constructor';
      if (id.includes('apidom.worker')) return '\0virtual:apidom-worker-constructor';
    }
  },
  load(id) {
    // import.meta.url resolves to the chunk that inlines this virtual module
    // (dist/esm/plugins/editor-monaco/index.js), so ../../ reaches
    // dist/esm/{editor,apidom}.worker.js in native-ESM / Vite consumers.
    //
    // In Webpack-bundled consumers import.meta.url becomes a file:// URL, so
    // we detect that and fall back to globalThis.MonacoEnvironment.baseUrl
    // (a string like 'https://example.com/workers/' that the consumer must set
    // before loading SwaggerEditor when bundling with Webpack or similar tools).
    //
    // The URL is constructed inside the constructor (not at module top-level) so
    // the runtime check runs when the worker is actually spawned and
    // MonacoEnvironment.baseUrl is already in place.
    //
    // The URL is kept on a separate line from new Worker() to prevent Vite's
    // vite:worker-import-meta-url plugin from treating it as a worker asset
    // during the lib build.
    if (id === '\0virtual:editor-worker-constructor') {
      return `export default class EditorWorkerConstructor {
  constructor() {
    const _meta = new URL('../../editor.worker.js', import.meta.url);
    const _url = _meta.protocol === 'file:' ? new URL('editor.worker.js', globalThis.MonacoEnvironment?.baseUrl ?? location.origin) : _meta;
    return new Worker(_url);
  }
}`;
    }
    if (id === '\0virtual:apidom-worker-constructor') {
      return `export default class ApidomWorkerConstructor {
  constructor() {
    const _meta = new URL('../../apidom.worker.js', import.meta.url);
    const _url = _meta.protocol === 'file:' ? new URL('apidom.worker.js', globalThis.MonacoEnvironment?.baseUrl ?? location.origin) : _meta;
    return new Worker(_url);
  }
}`;
    }
  },
});

// output.paths produces root-relative paths (e.g. ./plugins/layout/index.js).
// Files nested under presets/ or plugins/ need paths relative to their own
// location. This plugin rewrites those imports after each chunk is rendered.
const fixCrossChunkPaths = () => ({
  name: 'fix-cross-chunk-paths',
  renderChunk(code, chunk) {
    const chunkDir = dirname(chunk.fileName); // e.g. 'presets/monaco' or '.'
    if (chunkDir === '.') return null; // root-level files already correct

    const result = code.replace(/from "(\.\/(?:plugins|presets)\/[^"]+\.js)"/g, (_, importPath) => {
      const bare = importPath.slice(2); // strip leading './'
      let rel = relative(chunkDir, bare);
      if (!rel.startsWith('.')) rel = `./${rel}`;
      return `from "${rel}"`;
    });
    return result !== code ? { code: result } : null;
  },
});

// Dynamically discover all plugins and presets (using glob v7 API)
const pluginFiles = glob.sync('src/plugins/*/index.{js,ts}');
const presetFiles = glob.sync('src/presets/*/index.{js,ts}');

const entries = {
  'swagger-editor': resolve(__dirname, 'src/App.tsx'),
};

pluginFiles.forEach((file) => {
  const key = file.replace(/^src\//, '').replace(/\.(js|ts)$/, '');
  entries[key] = resolve(__dirname, file);
});

presetFiles.forEach((file) => {
  const key = file.replace(/^src\//, '').replace(/\.(js|ts)$/, '');
  entries[key] = resolve(__dirname, file);
});

// Main ESM lib — plugins and presets as separate entry points, workers excluded.
// Workers are built separately as self-contained IIFE bundles (see below).
export const mainConfig = defineConfig({
  configFile: false,
  customLogger: logger,
  mode: 'production',

  plugins: [rewriteEditorWorkerImport()],

  assetsInclude: ['**/*.wasm'],

  build: {
    lib: {
      entry: entries,
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    outDir: 'dist/esm',
    sourcemap: true,
    emptyOutDir: true,
    cssCodeSplit: false,

    rollupOptions: {
      // id       — raw import specifier or resolved path
      // isResolved — true only after Vite has resolved the path; bare specifiers
      //              arrive here with isResolved:false and their original form.
      external: (id, _importer, isResolved) => {
        // Keep swagger-ui CSS bundled (side-effect import)
        if (id === 'swagger-ui-react/swagger-ui.css') return false;
        // Rollup checks external() BEFORE calling resolveId hooks for bare specifiers.
        // Allow ?worker imports through so rewriteEditorWorkerImport can intercept them.
        if (id.endsWith('?worker')) return false;
        // Plugin/preset cross-references — externalized so each chunk stays separate
        if (/^plugins\/.+\/index/.test(id) || /^presets\/.+\/index/.test(id)) return true;
        // Safety net: already-resolved absolute node_modules paths
        if (isResolved && id.includes('node_modules')) return true;
        // Bare npm specifiers (not relative/absolute/virtual) — externalize BEFORE
        // Vite resolves them to internal file paths like reselect/dist/reselect.mjs.
        // This preserves canonical package names in the output.
        if (!isResolved && !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('\0')) {
          return true;
        }
        return false;
      },

      output: {
        entryFileNames: '[name].js',
        assetFileNames: 'swagger-editor.css',

        // Only plugin/preset cross-references need path rewriting.
        // Bare npm specifiers are already externalized with their canonical names.
        paths: (id) => {
          if (id.startsWith('plugins/') || id.startsWith('presets/')) {
            return id.endsWith('.js') ? `./${id}` : `./${id}.js`;
          }
          return id;
        },
      },

      plugins: [wasmPlugin({ targetEnv: 'auto-inline' }), fixCrossChunkPaths()],
      onwarn: sharedOnwarn,
    },
  },

  resolve: {
    alias: {
      plugins: resolve(__dirname, 'src/plugins'),
      presets: resolve(__dirname, 'src/presets'),
    },
  },
});

// Self-contained IIFE workers — must be usable as Web Workers without any
// external imports, which is why they cannot be built as ESM entry points.
export const apidomWorkerConfig = defineConfig({
  configFile: false,
  customLogger: logger,
  mode: 'production',
  plugins: [inlineTreeSitterWasm(), inlineGrammarWasms()],
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
    outDir: 'dist/esm',
    sourcemap: false,
    emptyOutDir: false,
    rollupOptions: {
      output: { inlineDynamicImports: true },
      plugins: [wasmPlugin({ targetEnv: 'auto-inline' })],
      onwarn: sharedOnwarn,
    },
  },
});

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
    outDir: 'dist/esm',
    sourcemap: false,
    emptyOutDir: false,
    rollupOptions: {
      output: { inlineDynamicImports: true },
      plugins: [wasmPlugin({ targetEnv: 'auto-inline' })],
      onwarn: sharedOnwarn,
    },
  },
});

export default mainConfig;
