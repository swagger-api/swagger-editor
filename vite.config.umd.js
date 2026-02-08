import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import wasmPlugin from '@rollup/plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration for main bundle
export const mainConfig = defineConfig({
  configFile: false,
  mode: 'production',
  plugins: [
    react(),
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
      external: ['react', 'react-dom', 'fs', 'path', 'util', 'http', 'https', 'zlib'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        assetFileNames: 'swagger-editor.css',
      },
      plugins: [
        wasmPlugin({
          // Inline WASM as base64 for UMD compatibility
          targetEnv: 'auto-inline',
        }),
      ],
    },
  },
});

// Configuration for apidom worker
export const apidomWorkerConfig = defineConfig({
  configFile: false,
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
      entry: resolve(__dirname, 'src/plugins/editor-monaco-language-apidom/language/apidom.worker.js'),
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
      plugins: [
        wasmPlugin({
          targetEnv: 'auto-inline',
        }),
      ],
    },
  },
});

// Configuration for editor worker
export const editorWorkerConfig = defineConfig({
  configFile: false,
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
      entry: resolve(__dirname, 'node_modules/monaco-editor/esm/vs/editor/editor.worker.start.js'),
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
      plugins: [
        wasmPlugin({
          targetEnv: 'auto-inline',
        }),
      ],
    },
  },
});
