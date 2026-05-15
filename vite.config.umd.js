import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'rollup-plugin-polyfill-node';

import { logger, sharedOnwarn } from './vite/shared.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
      plugins: [nodePolyfills()],
      onwarn: sharedOnwarn,
    },
  },
});
