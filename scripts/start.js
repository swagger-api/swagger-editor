import fs from 'fs';
import chalk from 'chalk';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import clearConsole from 'react-dev-utils/clearConsole.js';
import checkRequiredFiles from 'react-dev-utils/checkRequiredFiles.js';
import { choosePort, createCompiler, prepareUrls } from 'react-dev-utils/WebpackDevServerUtils.js';
import openBrowser from 'react-dev-utils/openBrowser.js';
import { checkBrowsers } from 'react-dev-utils/browsersHelper.js';

import '../config/env.js';
import paths from '../config/paths.js';
import configFactory from '../config/webpack.config.js';
import webpackDevServerConfig from '../config/webpackDevServer.config.js';

process.on('unhandledRejection', (err) => {
  throw err;
});

const isInteractive = process.stdout.isTTY;

if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = '0.0.0.0';

checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    return choosePort(HOST, DEFAULT_PORT);
  })
  .then((port) => {
    if (port == null) {
      return;
    }

    const config = configFactory('development');
    const appPackageJson = JSON.parse(fs.readFileSync(paths.appPackageJson, 'utf8'));
    const appName = appPackageJson.name;

    const useTypeScript = fs.existsSync(paths.appTsConfig);
    const urls = prepareUrls('http', HOST, port, paths.publicUrlOrPath.slice(0, -1));
    const compiler = createCompiler({
      appName,
      config,
      urls,
      useTypeScript,
      webpack,
    });
    const serverConfig = {
      ...webpackDevServerConfig,
      host: HOST,
      port,
    };
    const devServer = new WebpackDevServer(serverConfig, compiler);
    devServer.startCallback(() => {
      if (isInteractive) {
        clearConsole();
      }

      console.log(chalk.cyan('Starting the development server...\n'));
      openBrowser(urls.localUrlForBrowser);
    });

    ['SIGINT', 'SIGTERM'].forEach((sig) => {
      process.on(sig, () => {
        devServer.stop();
        process.exit();
      });
    });

    process.stdin.on('end', () => {
      devServer.stop();
      process.exit();
    });
  })
  .catch((err) => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
