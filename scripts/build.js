import fs from 'fs-extra';
import path from 'path';
import webpack from 'webpack';
import chalk from 'chalk';
import checkRequiredFiles from 'react-dev-utils/checkRequiredFiles.js';
import { checkBrowsers } from 'react-dev-utils/browsersHelper.js';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages.js';
import printHostingInstructions from 'react-dev-utils/printHostingInstructions.js';
import FileSizeReporter from 'react-dev-utils/FileSizeReporter.js';
import printBuildError from 'react-dev-utils/printBuildError.js';

import '../config/env.js';
import configFactory from '../config/webpack.config.js';
import paths from '../config/paths.js';

process.on('unhandledRejection', (err) => {
  throw err;
});

const { measureFileSizesBeforeBuild, printFileSizesAfterBuild } = FileSizeReporter;

const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

const isInteractive = process.stdout.isTTY;

if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

const config = configFactory('production');

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: (file) => file !== paths.appHtml,
  });
}

function build(previousFileSizes) {
  console.log('Creating an optimized production build...');

  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }

        let errMessage = err.message;

        if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
          errMessage += `\nCompileError: Begins at CSS selector ${err.postcssNode.selector}`;
        }

        messages = formatWebpackMessages({
          errors: [errMessage],
          warnings: [],
        });
      } else {
        messages = formatWebpackMessages(
          stats.toJson({ all: false, warnings: true, errors: true })
        );
      }
      if (messages.errors.length) {
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        const filteredWarnings = messages.warnings.filter(
          (w) => !/Failed to parse source map/.test(w)
        );
        if (filteredWarnings.length) {
          console.log(
            chalk.yellow(
              '\nTreating warnings as errors because process.env.CI = true.\n' +
                'Most CI servers set it automatically.\n'
            )
          );
          return reject(new Error(filteredWarnings.join('\n\n')));
        }
      }

      const resolveArgs = {
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      };

      return resolve(resolveArgs);
    });
  });
}

checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    return measureFileSizesBeforeBuild(paths.appBuild);
  })
  .then((previousFileSizes) => {
    fs.emptyDirSync(paths.appBuild);
    copyPublicFolder();
    return build(previousFileSizes);
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          `\nSearch for the ${chalk.underline(
            chalk.yellow('keywords')
          )} to learn more about each warning.`
        );
        console.log(
          `To ignore, add ${chalk.cyan('// eslint-disable-next-line')} to the line before.\n`
        );
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }

      console.log('File sizes after gzip:\n');
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        paths.appBuild,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      );
      console.log();

      const appPackage = JSON.parse(fs.readFileSync(paths.appPackageJson, 'utf8'));
      const publicUrl = paths.publicUrlOrPath;
      const { publicPath } = config.output;
      const buildFolder = path.relative(process.cwd(), paths.appBuild);
      printHostingInstructions(appPackage, publicUrl, publicPath, buildFolder, false);
    },
    (err) => {
      console.log(chalk.red('Failed to compile.\n'));
      printBuildError(err);
      process.exit(1);
    }
  )
  .catch((err) => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
