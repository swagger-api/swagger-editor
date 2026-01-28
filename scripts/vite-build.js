#!/usr/bin/env node

// Set environment before importing any modules
import chalk from 'chalk';
import fs from 'fs-extra';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { build } from 'vite';
import { gzipSync } from 'zlib';

process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = 'production';

// Make unhandled promise rejections crash the process
process.on('unhandledRejection', (err) => {
  throw err;
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { gray, green, yellow, cyan } = chalk;

const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024; // 512 KB
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024; // 1 MB

function printFileSizes(stats, buildFolder) {
  console.log(`\n${green('File sizes after gzip:\n')}`);

  const assets = Object.entries(stats)
    .map(([name, size]) => ({
      name,
      size,
      folder: join(buildFolder, dirname(name)),
    }))
    .sort((a, b) => b.size - a.size);

  assets.forEach(({ name, size }) => {
    const sizeLabel = formatSize(size);
    const isLarge = size > WARN_AFTER_CHUNK_GZIP_SIZE;
    const isMedium = size > WARN_AFTER_BUNDLE_GZIP_SIZE;

    let color = gray;
    if (isLarge) color = yellow;
    else if (isMedium) color = cyan;

    console.log(`  ${color(sizeLabel.padStart(12))}  ${gray(name)}`);
  });

  console.log();

  const hasLargeChunks = assets.some((asset) => asset.size > WARN_AFTER_CHUNK_GZIP_SIZE);

  if (hasLargeChunks) {
    console.log(
      yellow(
        `\n⚠️  Warning: Some chunks are larger than ${formatSize(WARN_AFTER_CHUNK_GZIP_SIZE)}.`
      )
    );
    console.log(yellow('   Consider code-splitting or optimizing your bundle.\n'));
  }
}

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
      } else if (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.html')) {
        stats[relativePath] = getGzipSize(filePath);
      }
    });
  }

  walk(buildFolder);
  return stats;
}

async function buildApp() {
  // Load environment variables after NODE_ENV is set
  await import('../config/env.js');

  const buildFolder = resolve(__dirname, '../build');
  const configFile = resolve(__dirname, '../vite.config.app.ts');

  console.log(chalk.cyan('Creating production build...\n'));

  // Remove previous build
  await fs.remove(buildFolder);

  try {
    // Build with Vite
    await build({
      configFile,
      mode: 'production',
    });

    console.log(chalk.green('✓ Build completed successfully!\n'));

    // Measure and print file sizes
    const stats = measureFileSizes(buildFolder);
    printFileSizes(stats, buildFolder);

    console.log(green('The ') + cyan('build') + green(' folder is ready to be deployed.\n'));
  } catch (err) {
    console.log(chalk.red('Failed to compile.\n'));
    console.error(err);
    process.exit(1);
  }
}

buildApp();
