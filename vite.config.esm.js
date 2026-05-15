import { defineConfig } from 'vite';
import { resolve, dirname, relative } from 'path';
import glob from 'glob';
import { fileURLToPath } from 'url';
import { logger, sharedOnwarn, inlineAllWasms } from './vite.config.shared.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    return new Worker(_url, { type: 'module' });
  }
}`;
    }
    if (id === '\0virtual:apidom-worker-constructor') {
      return `export default class ApidomWorkerConstructor {
  constructor() {
    const _meta = new URL('../../apidom.worker.js', import.meta.url);
    const _url = _meta.protocol === 'file:' ? new URL('apidom.worker.js', globalThis.MonacoEnvironment?.baseUrl ?? location.origin) : _meta;
    return new Worker(_url, { type: 'module' });
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
// Workers are built separately as self-contained ESM bundles (see below).
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

      plugins: [fixCrossChunkPaths()],
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

// Self-contained ESM workers — spawned with { type: 'module' } by the virtual
// constructor modules above. codeSplitting:false flattens the bundle to a
// single file with no external imports.
export const apidomWorkerConfig = defineConfig({
  configFile: false,
  customLogger: logger,
  mode: 'production',
  plugins: [inlineAllWasms()],
  assetsInclude: ['**/*.wasm'],
  build: {
    lib: {
      entry: resolve(
        __dirname,
        'src/plugins/editor-monaco-language-apidom/language/apidom.worker.js'
      ),
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
  assetsInclude: ['**/*.wasm'],
  build: {
    lib: {
      entry: resolve(__dirname, 'node_modules/monaco-editor/esm/vs/editor/editor.worker.js'),
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

export default mainConfig;
