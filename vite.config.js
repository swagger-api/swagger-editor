import { defineConfig, loadEnv } from "vite"
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from "vite-plugin-static-copy"
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};


  return {
    base: '/',
    plugins: [ react(), nodePolyfills({
      include: ['path', 'stream', 'util', 'buffer', 'cwd'],
      exclude: ['http'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
        cwd: true,
      },
      overrides: {
        fs: 'memfs',
      },
      protocolImports: true,
    }),
      viteStaticCopy({
        targets: [
          {
            src: 'node_modules/monaco-editor/esm/vs/editor/editor.worker.js',
            dest: 'public',
          },
        ],
      }),
    ],
    assetsInclude: ['**/*.wasm'],
    resolve: {
      alias: [
        { find: 'plugins', replacement: '/src/plugins' },
        { find: 'presets', replacement: '/src/presets' },
      ],
    },
    build: {
      commonjsOptions: { transformMixedEsModules: true },
      sourcemap: false,
      sourcemapExcludeSources: true,
      target: 'esnext',
      outDir: 'build',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        // preserveEntrySignatures: "exports-only",
        // output: [
        //   {
        //     dir: './dist/umd',
        //     format: 'umd'
        //   },
        //   {
        //     dir: './dist/esm',
        //     format: 'es',
        //     preserveModules: true,
        //     preserveModulesRoot: 'src'
        //   }
        // ],
        external: ['fs', 'path', 'http', 'zlib', 'https'],
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
  }
})
