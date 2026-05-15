import { defineConfig, createLogger } from 'vite';
import { resolve, dirname } from 'path';
import react from '@vitejs/plugin-react';
import wasmPlugin from '@rollup/plugin-wasm';
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
      plugins: [
        nodePolyfills(),
        wasmPlugin({
          // Inline WASM as base64 for UMD compatibility
          targetEnv: 'auto-inline',
        }),
      ],
      onwarn: sharedOnwarn,
    },
  },
});

// Configuration for apidom worker
export const apidomWorkerConfig = defineConfig({
  configFile: false,
  customLogger: logger,
  mode: 'production',
  plugins: [],
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
      plugins: [
        wasmPlugin({
          targetEnv: 'auto-inline',
        }),
      ],
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
      plugins: [
        wasmPlugin({
          targetEnv: 'auto-inline',
        }),
      ],
      onwarn: sharedOnwarn,
    },
  },
});
