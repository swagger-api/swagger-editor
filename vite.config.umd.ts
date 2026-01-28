import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

import { wasmInlinePlugin } from './config/vite/plugins/wasmInline.js';
import { createMonacoResolverPlugin } from './config/vite/plugins/monacoResolver';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      createMonacoResolverPlugin(),
      react({
        jsxRuntime: 'automatic',
      }),
      nodePolyfills({
        include: ['buffer', 'stream', 'util', 'url', 'path', 'zlib', 'http', 'https'],
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
        protocolImports: true,
      }),
      wasmInlinePlugin(),
    ],

    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.REACT_APP_VERSION': JSON.stringify(env.REACT_APP_VERSION),
      'process.env.REACT_APP_APIDOM_WORKER_FILENAME': JSON.stringify(
        env.REACT_APP_APIDOM_WORKER_FILENAME || './apidom.worker.js'
      ),
      'process.env.REACT_APP_EDITOR_WORKER_FILENAME': JSON.stringify(
        env.REACT_APP_EDITOR_WORKER_FILENAME || './editor.worker.js'
      ),
    },

    resolve: {
      alias: {
        plugins: resolve(__dirname, 'src/plugins'),
        presets: resolve(__dirname, 'src/presets'),
        src: resolve(__dirname, 'src'),
        'monaco-editor': resolve(__dirname, 'node_modules/monaco-editor'),
        '@stoplight/ordered-object-literal': resolve(
          __dirname,
          'node_modules/@stoplight/ordered-object-literal/src/index.mjs'
        ),
        'react/jsx-runtime.js': 'react/jsx-runtime',
        buffer: resolve(__dirname, 'node_modules/buffer/index.js'),
        fs: resolve(__dirname, 'config/vite/stubs/fs.js'),
        // UMD-specific aliases for bundled dependencies
        'react-is': resolve(__dirname, 'node_modules/react-is'),
        dompurify: resolve(__dirname, 'node_modules/dompurify'),
        '@babel/runtime': resolve(__dirname, 'node_modules/@babel/runtime'),
      },
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    },

    css: {
      preprocessorOptions: {
        scss: {
          // SCSS preprocessing options
        },
      },
    },

    build: {
      outDir: 'dist/umd',
      sourcemap: false,
      minify: 'terser',
      lib: {
        entry: resolve(__dirname, 'src/App.tsx'),
        name: 'SwaggerEditor',
        formats: ['umd'],
        fileName: () => 'swagger-editor.js',
      },
      terserOptions: {
        ecma: 5,
        compress: {
          ecma: 5,
          warnings: false,
          comparisons: false,
          inline: 2,
        },
        mangle: {
          safari10: true,
        },
        output: {
          ecma: 5,
          comments: false,
          ascii_only: true,
        },
      },
      rollupOptions: {
        external: ['react', 'react-dom'],
        output: {
          exports: 'default',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') {
              return 'swagger-editor.css';
            }
            return '[name].[ext]';
          },
          inlineDynamicImports: true, // Single file output
        },
      },
      cssCodeSplit: false,
      chunkSizeWarningLimit: 2048, // 2MB for UMD
    },

    worker: {
      format: 'iife',
      plugins: () => [wasmInlinePlugin()],
      rollupOptions: {
        output: {
          entryFileNames: '[name].js',
          format: 'iife',
        },
      },
    },
  };
});
