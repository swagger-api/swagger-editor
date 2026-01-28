#!/usr/bin/env node

// Set environment before importing any modules
import chalk from 'chalk';
import fs from 'fs-extra';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { build } from 'vite';
import { gzipSync } from 'zlib';

import { wasmInlinePlugin } from '../config/vite/plugins/wasmInline.js';

process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = 'production';

// Make unhandled promise rejections crash the process
process.on('unhandledRejection', (err) => {
  throw err;
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getGzipSize(filePath) {
  const content = fs.readFileSync(filePath);
  return gzipSync(content).length;
}

function measureFileSizes(buildFolder) {
  const stats = {};

  function walk(dir, basePath = '') {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = join(dir, file);
      const relativePath = join(basePath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walk(filePath, relativePath);
      } else if (file.endsWith('.js') || file.endsWith('.css')) {
        const size = getGzipSize(filePath);
        stats[relativePath] = size;
      }
    });
  }

  walk(buildFolder);
  return stats;
}

function printFileSizes(stats, label) {
  console.log(chalk.green(`\n${label} bundle sizes after gzip:\n`));

  const assets = Object.entries(stats)
    .map(([name, size]) => ({ name, size }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 10); // Show top 10 files

  assets.forEach(({ name, size }) => {
    const sizeLabel = formatSize(size);
    console.log(`  ${chalk.gray(sizeLabel.padStart(12))}  ${chalk.gray(name)}`);
  });

  const totalSize = Object.values(stats).reduce((sum, size) => sum + size, 0);
  console.log(`\n  ${chalk.cyan('Total:'.padStart(12))}  ${chalk.cyan(formatSize(totalSize))}\n`);
}

async function buildESM() {
  // Load environment variables after NODE_ENV is set
  await import('../config/env.js');

  const BUILD_ESM = process.env.BUILD_ESM_BUNDLE === 'true';
  const buildFolder = resolve(__dirname, '../dist/esm');
  const configFile = resolve(__dirname, '../vite.config.esm.ts');

  console.log(chalk.cyan('Building ESM bundle...\n'));

  // Remove previous build
  await fs.remove(buildFolder);

  try {
    // Build with Vite
    await build({
      configFile,
      mode: 'production',
    });

    // Build workers separately for ESM
    await buildESMWorkers();

    console.log(chalk.green('✓ ESM bundle completed!\n'));

    // Measure and print file sizes
    const stats = measureFileSizes(buildFolder);
    printFileSizes(stats, 'ESM');
  } catch (err) {
    console.log(chalk.red('Failed to build ESM bundle.\n'));
    console.error(err);
    process.exit(1);
  }
}

async function buildESMWorkers() {
  const apidomWorkerPath = resolve(
    __dirname,
    '../src/plugins/editor-monaco-language-apidom/language/apidom.worker.js'
  );
  const editorWorkerPath = resolve(
    __dirname,
    '../node_modules/monaco-editor/esm/vs/editor/editor.worker.start.js'
  );
  const outputDir = resolve(__dirname, '../dist/esm');

  console.log(chalk.gray('  Building workers for ESM...'));

  // Build apidom.worker
  await build({
    configFile: false,
    build: {
      outDir: outputDir,
      emptyOutDir: false, // Don't clear the directory
      lib: {
        entry: apidomWorkerPath,
        name: 'ApiDOMWorker',
        formats: ['es'],
        fileName: () => 'apidom.worker.js',
      },
      rollupOptions: {
        output: {
          format: 'es',
        },
      },
      minify: false,
      sourcemap: true,
    },
    plugins: [wasmInlinePlugin()],
  });

  // Build editor.worker
  await build({
    configFile: false,
    build: {
      outDir: outputDir,
      emptyOutDir: false, // Don't clear the directory
      lib: {
        entry: editorWorkerPath,
        name: 'EditorWorker',
        formats: ['es'],
        fileName: () => 'editor.worker.js',
      },
      rollupOptions: {
        output: {
          format: 'es',
        },
      },
      minify: false,
      sourcemap: true,
    },
  });

  console.log(chalk.gray('  ✓ Workers built\n'));
}

async function buildUMD() {
  // Load environment variables after NODE_ENV is set
  await import('../config/env.js');

  const BUILD_UMD = process.env.BUILD_UMD_BUNDLE === 'true';
  const buildFolder = resolve(__dirname, '../dist/umd');
  const configFile = resolve(__dirname, '../vite.config.umd.ts');

  console.log(chalk.cyan('Building UMD bundle...\n'));

  // Remove previous build
  await fs.remove(buildFolder);

  try {
    // Build main UMD bundle
    await build({
      configFile,
      mode: 'production',
    });

    // Build workers separately
    await buildUMDWorkers();

    console.log(chalk.green('✓ UMD bundle completed!\n'));

    // Measure and print file sizes
    const stats = measureFileSizes(buildFolder);
    printFileSizes(stats, 'UMD');
  } catch (err) {
    console.log(chalk.red('Failed to build UMD bundle.\n'));
    console.error(err);
    process.exit(1);
  }
}

async function buildUMDWorkers() {
  const apidomWorkerPath = resolve(
    __dirname,
    '../src/plugins/editor-monaco-language-apidom/language/apidom.worker.js'
  );
  const editorWorkerPath = resolve(
    __dirname,
    '../node_modules/monaco-editor/esm/vs/editor/editor.worker.start.js'
  );
  const outputDir = resolve(__dirname, '../dist/umd');

  console.log(chalk.gray('  Building workers for UMD...'));

  // Build apidom.worker
  await build({
    configFile: false,
    build: {
      outDir: outputDir,
      emptyOutDir: false, // Don't clear the directory
      lib: {
        entry: apidomWorkerPath,
        name: 'ApiDOMWorker',
        formats: ['iife'],
        fileName: () => 'apidom.worker.js',
      },
      rollupOptions: {
        output: {
          format: 'iife',
        },
      },
      minify: 'terser',
      sourcemap: false,
    },
    plugins: [wasmInlinePlugin()],
  });

  // Build editor.worker
  await build({
    configFile: false,
    build: {
      outDir: outputDir,
      emptyOutDir: false, // Don't clear the directory
      lib: {
        entry: editorWorkerPath,
        name: 'EditorWorker',
        formats: ['iife'],
        fileName: () => 'editor.worker.js',
      },
      rollupOptions: {
        output: {
          format: 'iife',
        },
      },
      minify: 'terser',
      sourcemap: false,
    },
  });

  console.log(chalk.gray('  ✓ Workers built\n'));
}

async function buildAll() {
  // Load environment variables after NODE_ENV is set
  await import('../config/env.js');

  const BUILD_ESM = process.env.BUILD_ESM_BUNDLE === 'true';
  const BUILD_UMD = process.env.BUILD_UMD_BUNDLE === 'true';

  console.log(chalk.cyan.bold('\n=============================================='));
  console.log(chalk.cyan.bold('  Building SwaggerEditor Library Bundles'));
  console.log(chalk.cyan.bold('==============================================\n'));

  const startTime = Date.now();

  try {
    if (BUILD_ESM) {
      await buildESM();
    }

    if (BUILD_UMD) {
      await buildUMD();
    }

    if (!BUILD_ESM && !BUILD_UMD) {
      console.log(
        chalk.yellow(
          '⚠️  No bundle type specified. Set BUILD_ESM_BUNDLE=true or BUILD_UMD_BUNDLE=true\n'
        )
      );
      process.exit(1);
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(
      chalk.green.bold('✓ All bundles built successfully!') + chalk.gray(` (${duration}s)\n`)
    );
  } catch (err) {
    console.log(chalk.red('Failed to build bundles.\n'));
    console.error(err);
    process.exit(1);
  }
}

buildAll();
