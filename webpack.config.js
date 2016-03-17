'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',

  entry: [
    './index.js'
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  module: {
    loaders: [
      {
        test: /\.png$/,
        loader: "url-loader",
        query: {mimetype: "image/png"}
      },
      {
        test: /\.less$/,
        loader: "style!css!less"
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline'
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ]
  }
};
