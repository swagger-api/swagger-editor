import { defineConfig } from 'vite';
import { resolve } from 'path';
import glob from 'glob';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import wasmPlugin from '@rollup/plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamically discover all plugins and presets (using glob v7 API)
const pluginFiles = glob.sync('src/plugins/*/index.{js,ts}');
const presetFiles = glob.sync('src/presets/*/index.{js,ts}');

const entries = {
  'swagger-editor': resolve(__dirname, 'src/App.tsx'),
  'apidom.worker': resolve(__dirname, 'src/plugins/editor-monaco-language-apidom/language/apidom.worker.js'),
  'editor.worker': resolve(__dirname, 'node_modules/monaco-editor/esm/vs/editor/editor.worker.start.js'),
};

// Add plugin entries
pluginFiles.forEach(file => {
  const key = file.replace(/^src\//, '').replace(/\.(js|ts)$/, '');
  entries[key] = resolve(__dirname, file);
});

// Add preset entries
presetFiles.forEach(file => {
  const key = file.replace(/^src\//, '').replace(/\.(js|ts)$/, '');
  entries[key] = resolve(__dirname, file);
});

export default defineConfig({
  mode: 'production',

  plugins: [
    topLevelAwait(),
    nodePolyfills({
      include: ['path', 'stream', 'util', 'buffer'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],

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
      external: (id) => {
        // Don't externalize worker entry points
        if (id.includes('editor.worker.start.js')) return false;
        if (id.includes('apidom.worker.js')) return false;

        // Keep swagger-ui CSS bundled
        if (id === 'swagger-ui-react/swagger-ui.css') return false;

        // Externalize all node_modules
        if (id.includes('node_modules')) return true;

        // Externalize plugin/preset cross-references
        return /^plugins\/.+\/index/.test(id) || /^presets\/.+\/index/.test(id);
      },

      output: {
        entryFileNames: '[name].js',
        assetFileNames: 'swagger-editor.css',

        // Convert plugin/preset imports to relative paths
        paths: (id) => {
          if (id.startsWith('plugins/')) return `./${id}.js`;
          if (id.startsWith('presets/')) return `./${id}.js`;
          return id;
        },
      },

      plugins: [
        wasmPlugin({
          targetEnv: 'auto-inline',
        }),
      ],
    },
  },

  resolve: {
    alias: {
      plugins: resolve(__dirname, 'src/plugins'),
      presets: resolve(__dirname, 'src/presets'),
    },
  },
});
