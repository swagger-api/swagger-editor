import { defineConfig, loadEnv, createLogger } from 'vite';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = createLogger();
const loggerWarn = logger.warn.bind(logger);
logger.warn = (msg, options) => {
  if (msg.includes('has been externalized for browser compatibility')) return;
  loggerWarn(msg, options);
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    customLogger: logger,
    base: '/',
    server: {
      // Ensure workers are served with correct MIME type
      fs: {
        strict: false,
      },
    },
    plugins: [react()],
    define: {
      global: 'globalThis',
    },
    optimizeDeps: {
      rolldownOptions: {
        plugins: [
          // Must run before nodePolyfills so it resolves 'fs' to our shim
          // instead of the rollup-plugin-polyfill-node stub that lacks readFile
          {
            name: 'fs-shim',
            resolveId(id) {
              if (id === 'fs') return path.resolve(__dirname, 'src/polyfills/fs-shim.js');
              return null;
            },
          },
          nodePolyfills(),
        ],
      },
      include: [
        '@codingame/monaco-vscode-api/workers/editor.worker',
        'monaco-editor/esm/vs/editor/editor.worker.js',
      ],
    },
    assetsInclude: ['**/*.wasm'],
    resolve: {
      alias: [
        { find: 'plugins', replacement: '/src/plugins' },
        { find: 'presets', replacement: '/src/presets' },
        { find: 'fs', replacement: '/src/polyfills/fs-shim.js' },
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
          // Third-party packages (web-tree-sitter, avsc, spectral) reference Node
          // built-ins that Vite externalizes; they fall back gracefully at runtime.
          if (warning.message.includes('has been externalized for browser compatibility')) return;
          warn(warning);
        },
      },
    },
  };
});
