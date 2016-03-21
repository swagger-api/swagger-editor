'use strict';

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'source-map',

  entry: {
    app: ['./index.js']
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('styles.css')
  ],

  module: {
    loaders: [
      {
        test: '/\.js$/',
        loader: 'eslint-loader',
        exclude: 'node_modules/'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.worker.js$/,
        loader: 'worker-loader'
      },
      {
        test: /\.png$/,
        loader: "url-loader",
        query: {mimetype: "image/png"}
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract(
                    // activate source maps via loader query
                    'css?sourceMap!' +
                    'less?sourceMap'
                )
      },
      {
        test: /images\/*\.svg$/,
        loader: 'svg-inline'
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ]
  }
};
