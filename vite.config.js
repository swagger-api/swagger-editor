import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin';
import nodePolyfills from 'rollup-plugin-polyfill-node';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    base: '/',
    server: {
      // Ensure workers are served with correct MIME type
      fs: {
        strict: false,
      },
    },
    plugins: [
      react(),
      // Copy worker files for production build
      viteStaticCopy({
        targets: [
          {
            src: 'src/plugins/editor-monaco-language-apidom/language/apidom.worker.js',
            dest: '',
            rename: 'apidom.worker.js',
          },
          {
            src: 'node_modules/monaco-editor/esm/vs/editor/editor.worker.js',
            dest: '',
            rename: 'editor.worker.js',
          },
        ],
      }),
    ],
    optimizeDeps: {
      esbuildOptions: {
        plugins: [importMetaUrlPlugin],
      },
      include: ['vscode-textmate', 'vscode-oniguruma', '@vscode/vscode-languagedetection'],
    },
    assetsInclude: ['**/*.wasm'],
    resolve: {
      alias: [
        { find: 'plugins', replacement: '/src/plugins' },
        { find: 'presets', replacement: '/src/presets' },
      ],
    },
    worker: {
      format: 'es',
      plugins: () => [],
    },
    build: {
      commonjsOptions: { transformMixedEsModules: true },
      sourcemap: false,
      sourcemapExcludeSources: true,
      target: 'esnext',
      outDir: 'build',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        plugins: [nodePolyfills()],
        onwarn(warning, warn) {
          if (warning.message.includes('Use of eval')) return;
          warn(warning);
        },
      },
    },
  };
});
