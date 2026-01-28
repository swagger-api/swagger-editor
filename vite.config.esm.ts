import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { glob } from 'glob';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { wasmInlinePlugin } from './config/vite/plugins/wasmInline.js';
import { createMonacoResolverPlugin } from './config/vite/plugins/monacoResolver';
import dts from 'vite-plugin-dts';

// Get all plugin and preset entry points
const getEntries = () => {
  const entries: Record<string, string> = {
    'swagger-editor': resolve(__dirname, 'src/App.tsx'),
  };

  // Add all plugins
  const plugins = glob.sync('src/plugins/*/index.{js,ts,tsx}');
  plugins.forEach((plugin) => {
    const name = plugin.match(/plugins\/([^/]+)\//)?.[1];
    if (name) {
      entries[`plugins/${name}/index`] = resolve(__dirname, plugin);
    }
  });

  // Add all presets
  const presets = glob.sync('src/presets/*/index.{js,ts,tsx}');
  presets.forEach((preset) => {
    const name = preset.match(/presets\/([^/]+)\//)?.[1];
    if (name) {
      entries[`presets/${name}/index`] = resolve(__dirname, preset);
    }
  });

  return entries;
};

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
      dts({
        outDir: 'dist/esm/types',
        insertTypesEntry: true,
        rollupTypes: true,
      }),
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
      outDir: 'dist/esm',
      sourcemap: true,
      minify: false, // Don't minify library builds
      lib: {
        entry: getEntries(),
        formats: ['es'],
        fileName: (format, entryName) => {
          if (entryName.includes('/')) {
            return `${entryName}.js`;
          }
          return `${entryName}.js`;
        },
      },
      rollupOptions: {
        external: [
          'react',
          'react-dom',
          'react/jsx-runtime',
          'react/jsx-runtime.js',
          'prop-types',
          'immutable',
          'swagger-ui-react',
          '@asyncapi/react-component',
          // External all node_modules except those we need to bundle
          /^(?!.*\.wasm$).*node_modules.*/,
        ],
        output: {
          preserveModules: false,
          exports: 'named',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') {
              return 'swagger-editor.css';
            }
            return 'assets/[name].[ext]';
          },
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'jsxRuntime',
          },
        },
      },
      cssCodeSplit: false, // Single CSS file
    },

    worker: {
      format: 'es',
      plugins: () => [wasmInlinePlugin()],
      rollupOptions: {
        external: [],
        output: {
          entryFileNames: '[name].js',
        },
      },
    },
  };
});
