import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import glob from 'glob';
import { fileURLToPath } from 'url';

import { logger, sharedOnwarn } from './vite/shared.js';
import { inlineAllWasms } from './vite/plugins/inline-all-wasms.js';
import { rewriteEditorWorkerImport } from './vite/plugins/rewrite-editor-worker-import.js';
import { fixCrossChunkPaths } from './vite/plugins/fix-cross-chunk-paths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
