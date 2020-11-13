'use strict';

const path = require('path');

const { nonMinimizeTrait, minimizeTrait } = require('./traits.config');

const browser = {
  mode: 'production',
  entry: ['./src/index.js'],
  target: 'web',
  performance: {
    maxEntrypointSize: 712000,
    maxAssetSize: 712000,
  },
  node: {
    fs: 'empty',
  },
  externals: {
    esprima: true,
  },
  output: {
    path: path.resolve('./dist'),
    filename: 'generic-editor.browser.js',
    libraryTarget: 'umd',
    library: 'genericEditor',
  },
  resolve: {
    extensions: ['.mjs', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        loader: 'file-loader',
        type: 'javascript/auto',
      },
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true,
          },
        },
      },
    ],
  },
  ...nonMinimizeTrait,
};

const browserMin = {
  mode: 'production',
  entry: ['./src/index.js'],
  target: 'web',
  output: {
    path: path.resolve('./dist'),
    filename: 'generic-editor.browser.min.js',
    libraryTarget: 'umd',
    library: 'genericEditor',
  },
  node: {
    fs: 'empty',
  },
  externals: {
    esprima: true,
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.mjs', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        loader: 'file-loader',
        type: 'javascript/auto',
      },
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true,
          },
        },
      },
    ],
  },
  ...minimizeTrait,
};

module.exports = [browser, browserMin];
