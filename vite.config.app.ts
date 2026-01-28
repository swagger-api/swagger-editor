import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

import { createBuildInfoPlugin } from './config/vite/plugins/buildInfo';
import { createWorkerPlugin } from './config/vite/plugins/worker';
import { wasmInlinePlugin } from './config/vite/plugins/wasmInline.js';
import { createDevWorkersPlugin } from './config/vite/plugins/devWorkers';
import { createMonacoResolverPlugin } from './config/vite/plugins/monacoResolver';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDev = mode === 'development';

  return {
    plugins: [
      createMonacoResolverPlugin(),
      react({
        babel: {
          plugins: [isDev && 'react-refresh/babel'].filter(Boolean),
        },
      }),
      nodePolyfills({
        // Add Node.js polyfills for AsyncAPI parser
        // Note: 'fs' is excluded here and uses custom stub via alias
        include: ['stream', 'util', 'url', 'path', 'zlib', 'http', 'https'],
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
        protocolImports: true,
        // Don't include 'buffer' here - we'll use the one from dependencies
      }),
      createBuildInfoPlugin(),
      createWorkerPlugin({
        apidomWorkerPath: env.REACT_APP_APIDOM_WORKER_PATH,
        editorWorkerPath: env.REACT_APP_EDITOR_WORKER_PATH,
      }),
      createDevWorkersPlugin(),
      wasmInlinePlugin(),
    ],

    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.REACT_APP_VERSION': JSON.stringify(env.REACT_APP_VERSION),
      'process.env.REACT_APP_DEFINITION_FILE': JSON.stringify(env.REACT_APP_DEFINITION_FILE || ''),
      'process.env.REACT_APP_DEFINITION_URL': JSON.stringify(env.REACT_APP_DEFINITION_URL || ''),
      'process.env.REACT_APP_APIDOM_WORKER_FILENAME': JSON.stringify(
        env.REACT_APP_APIDOM_WORKER_FILENAME || './apidom.worker.js'
      ),
      'process.env.REACT_APP_EDITOR_WORKER_FILENAME': JSON.stringify(
        env.REACT_APP_EDITOR_WORKER_FILENAME || './editor.worker.js'
      ),
      // Fix for Buffer global
      global: 'globalThis',
    },

    resolve: {
      alias: {
        plugins: resolve(__dirname, 'src/plugins'),
        presets: resolve(__dirname, 'src/presets'),
        src: resolve(__dirname, 'src'),
        // Fix for Monaco Editor
        'monaco-editor': resolve(__dirname, 'node_modules/monaco-editor'),
        // Fix for Stoplight - correct path is src/index.mjs, not dist/index.mjs
        '@stoplight/ordered-object-literal': resolve(
          __dirname,
          'node_modules/@stoplight/ordered-object-literal/src/index.mjs'
        ),
        // React JSX runtime fix
        'react/jsx-runtime.js': 'react/jsx-runtime',
        // Use the buffer package from dependencies (v6.0.3) instead of polyfill
        buffer: resolve(__dirname, 'node_modules/buffer/index.js'),
        // Use custom fs stub for browser compatibility
        fs: resolve(__dirname, 'config/vite/stubs/fs.js'),
      },
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    },

    css: {
      preprocessorOptions: {
        scss: {
          // SCSS preprocessing options
        },
      },
      modules: {
        localsConvention: 'camelCase',
      },
    },

    build: {
      outDir: 'build',
      // Disable sourcemaps in production to reduce memory usage during build
      sourcemap: isDev,
      minify: !isDev,
      target: 'es2015',
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
      },
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          'apidom.worker': resolve(
            __dirname,
            'src/plugins/editor-monaco-language-apidom/language/apidom.worker.js'
          ),
          'editor.worker': resolve(
            __dirname,
            'node_modules/monaco-editor/esm/vs/editor/editor.worker.start.js'
          ),
        },
        output: {
          manualChunks: (id) => {
            // Don't chunk worker files
            if (id.includes('apidom.worker') || id.includes('editor.worker')) {
              return undefined;
            }

            // Let Vite handle chunking automatically to avoid circular dependencies
            // Manual chunking of large interdependent packages causes runtime errors:
            // - React: "rf is not a function"
            // - Swagger/ApiDOM: "Cannot access 'WN' before initialization"
            // - Monaco: "Cannot access 'Cw' before initialization"
            //
            // Vite's automatic chunking properly handles module dependencies and
            // execution order, preventing these circular reference errors.
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: (chunkInfo) => {
            // Workers go to root, other entries to assets/
            if (chunkInfo.name === 'apidom.worker' || chunkInfo.name === 'editor.worker') {
              return '[name].js';
            }
            return 'assets/[name]-[hash].js';
          },
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
        // Suppress warnings from known issues in third-party libraries
        onwarn(warning, warn) {
          // Ignore eval warnings from protobufjs and web-tree-sitter
          // These libraries use eval for dynamic code generation, which is acceptable for their use case
          if (
            warning.code === 'EVAL' &&
            (warning.id?.includes('protobufjs') || warning.id?.includes('web-tree-sitter'))
          ) {
            return;
          }
          // Ignore circular chunk warnings - we've optimized chunking to minimize issues
          // Some circularity is unavoidable due to how vendor packages are structured
          if (warning.message?.includes('Circular chunk')) {
            return;
          }
          // Use default warning handler for other warnings
          warn(warning);
        },
      },
      chunkSizeWarningLimit: 1024, // 1MB
      assetsInlineLimit: 10240, // 10KB (same as webpack)
    },

    publicDir: 'public',

    server: {
      port: parseInt(env.PORT || '3000', 10),
      host: '0.0.0.0',
      open: false,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
      },
      fs: {
        strict: false,
      },
    },

    preview: {
      port: 3050,
      host: '0.0.0.0',
    },

    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'swagger-ui-react',
        'immutable',
        'buffer',
        'stream-browserify',
        'util',
        'url',
        'lodash',
      ],
      exclude: ['@apidom/parser-adapter-asyncapi-json-2'],
      esbuildOptions: {
        target: 'es2015',
        define: {
          global: 'globalThis',
        },
      },
    },

    worker: {
      format: 'es',
      plugins: () => [wasmInlinePlugin()],
      rollupOptions: {
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name]-[hash].js',
          assetFileNames: '[name].[ext]',
        },
      },
    },
  };
});
