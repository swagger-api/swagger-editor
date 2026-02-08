import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { createHtmlPlugin } from 'vite-plugin-html';
import wasmPlugin from '@rollup/plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin';
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
      nodePolyfills({
        include: ['path', 'stream', 'util', 'buffer', 'cwd', 'fs'],
        exclude: ['http'],
        globals: {
          Buffer: true,
          global: true,
          process: true,
          cwd: true,
        },
        protocolImports: true,
        overrides: {
          fs: 'memfs',
        },
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
      include: ['vscode-textmate', 'vscode-oniguruma', '@vscode/vscode-languagedetection'],
    },

    assetsInclude: ['**/*.wasm'],

    build: {
      outDir: 'build',
      sourcemap: true,
      emptyOutDir: true,
      target: 'esnext',
      commonjsOptions: { transformMixedEsModules: true },
      chunkSizeWarningLimit: 1000,

      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        },

        output: {
          entryFileNames: 'static/js/[name].[hash].js',
          chunkFileNames: 'static/js/[name].[hash].chunk.js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'static/css/[name].[hash].css';
            }
            return 'static/media/[name].[hash][extname]';
          },
          manualChunks: (id) => {
            // Split vendor chunks to reduce memory pressure
            if (id.includes('node_modules')) {
              if (id.includes('monaco-editor') || id.includes('monaco-vscode')) {
                return 'vendor-monaco';
              }
              if (id.includes('swagger-ui') || id.includes('@swagger-api')) {
                return 'vendor-swagger';
              }
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('@asyncapi')) {
                return 'vendor-asyncapi';
              }
              return 'vendor';
            }
          },
        },

        external: ['esprima'],

        plugins: [
          wasmPlugin({
            targetEnv: 'auto-inline',
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
      ],
    },

    worker: {
      format: 'es',
      rollupOptions: {
        output: {
          entryFileNames: 'static/js/[name].js',
        },
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
