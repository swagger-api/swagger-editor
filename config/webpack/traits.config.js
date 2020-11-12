'use strict';

const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const nonMinimizeTrait = {
  plugins: [new LodashModuleReplacementPlugin()],
  optimization: {
    minimize: false,
    usedExports: false,
    concatenateModules: false,
  },
};

const minimizeTrait = {
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new LodashModuleReplacementPlugin(),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            warnings: false,
          },
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
};

module.exports = {
  nonMinimizeTrait,
  minimizeTrait,
};
