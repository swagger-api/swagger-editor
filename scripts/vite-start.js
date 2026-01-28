#!/usr/bin/env node

// Set environment before importing any modules
import chalk from 'chalk';
import { createServer } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';

// Make unhandled promise rejections crash the process
process.on('unhandledRejection', (err) => {
  throw err;
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function start() {
  // Load environment variables after NODE_ENV is set
  await import('../config/env.js');

  const HOST = process.env.HOST || '0.0.0.0';
  const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
  console.log(chalk.cyan('Starting Vite development server...\n'));

  try {
    // Load Vite config
    const configFile = resolve(__dirname, '../vite.config.app.ts');

    // Create Vite server
    const server = await createServer({
      configFile,
      server: {
        port: DEFAULT_PORT,
        host: HOST,
      },
    });

    await server.listen();

    const { info } = server.config.logger;

    info(chalk.green(`\n  ✓ Development server started successfully!\n`));

    server.printUrls();

    info(
      `${chalk.cyan('\n  Note: ')}The development build is not optimized.\n` +
        `  To create a production build, use ${chalk.cyan('npm run build')}.\n`
    );
  } catch (err) {
    console.log(chalk.red('Failed to start development server.\n'));
    console.error(err);
    process.exit(1);
  }
}

start();
