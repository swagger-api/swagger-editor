import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { createHtmlPlugin } from 'vite-plugin-html';
import wasmPlugin from '@rollup/plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    mode: 'production',
    base: '/',

    plugins: [
      react(),
      topLevelAwait(),
      // Copy tree-sitter WASM files to root for worker access
      viteStaticCopy({
        targets: [
          {
            src: 'node_modules/@swagger-api/apidom-parser-adapter-json/wasm/tree-sitter-json.wasm',
            dest: '.',
          },
          {
            src: 'node_modules/@swagger-api/apidom-parser-adapter-yaml-1-2/wasm/tree-sitter-yaml.wasm',
            dest: '.',
          },
          {
            src: 'node_modules/@swagger-api/apidom-parser-adapter-yaml-1-2/node_modules/@tree-sitter-grammars/tree-sitter-yaml/tree-sitter-yaml.wasm',
            dest: '.',
            rename: 'tree-sitter.wasm',
          },
        ],
      }),
      nodePolyfills({
        include: ['path', 'stream', 'util', 'buffer', 'cwd'],
        exclude: ['http', 'fs'], // Exclude fs - not needed in browser
        globals: {
          Buffer: true,
          global: true,
          process: true,
          cwd: true,
        },
        protocolImports: true,
      }),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            VITE_VERSION: env.VITE_VERSION || '5.2.0',
          },
        },
      }),
    ],

    optimizeDeps: {
      esbuildOptions: {
        plugins: [importMetaUrlPlugin],
      },
      include: [
        'vscode-textmate',
        'vscode-oniguruma',
        '@vscode/vscode-languagedetection',
        '@babel/runtime-corejs3/core-js/aggregate-error',
        'ramda',
        'ramda-adjunct',
        '@stoplight/spectral-core',
        '@stoplight/spectral-functions',
        '@stoplight/spectral-runtime',
      ],
    },

    assetsInclude: ['**/*.wasm'],

    build: {
      outDir: 'build',
      sourcemap: true,
      emptyOutDir: true,
      target: 'esnext',
      commonjsOptions: {
        transformMixedEsModules: true,
        include: [/node_modules\/@stoplight\/spectral/, /node_modules\/minim/, /node_modules/],
      },
      chunkSizeWarningLimit: 1000,

      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          // Build workers as separate entry points
          'apidom.worker': path.resolve(
            __dirname,
            'src/plugins/editor-monaco-language-apidom/language/apidom.worker.js'
          ),
          'editor.worker': path.resolve(
            __dirname,
            'node_modules/monaco-editor/esm/vs/editor/editor.worker.start.js'
          ),
        },

        output: {
          hoistTransitiveImports: false,
          entryFileNames: (chunkInfo) => {
            // Place worker files at root without hash
            if (chunkInfo.name.includes('worker')) {
              return '[name].js';
            }
            // Regular entry files go in static/js with hash
            return 'static/js/[name].[hash].js';
          },
          chunkFileNames: 'static/js/[name].[hash].chunk.js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'static/css/[name].[hash].css';
            }
            return 'static/media/[name].[hash][extname]';
          },
        },

        external: ['esprima'],

        plugins: [
          wasmPlugin({
            targetEnv: 'browser',
          }),
        ],

        onwarn(warning, warn) {
          if (warning.message.includes('Use of eval')) return;
          if (warning.message.includes('Module "fs" has been externalized')) return;
          if (warning.message.includes('Module "path" has been externalized')) return;
          if (warning.message.includes('Module "zlib" has been externalized')) return;
          if (warning.message.includes('Module "http" has been externalized')) return;
          if (warning.message.includes('Module "https" has been externalized')) return;
          warn(warning);
        },
      },
    },

    resolve: {
      alias: [
        { find: 'plugins', replacement: path.resolve(__dirname, 'src/plugins') },
        { find: 'presets', replacement: path.resolve(__dirname, 'src/presets') },
        { find: 'fs', replacement: path.resolve(__dirname, 'src/polyfills/fs-shim.js') },
      ],
    },

    worker: {
      format: 'es',
      rollupOptions: {
        output: {
          entryFileNames: 'static/js/[name].js',
        },
        plugins: [
          wasmPlugin({
            targetEnv: 'browser',
          }),
        ],
      },
      plugins: () => [
        nodePolyfills({
          include: ['path', 'stream', 'util', 'buffer'],
          globals: {
            Buffer: true,
            global: true,
            process: true,
          },
        }),
      ],
    },
  };
});
