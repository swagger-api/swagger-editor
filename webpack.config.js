'use strict';

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var NgAnnotatePlugin = require('ng-annotate-webpack-plugin');
var argv = require('minimist')(process.argv.slice(2));

var config = {
  devtool: 'source-map',

  entry: {
    app: ['./index.js']
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: 'dist/'
  },

  resolve: {
    extensions: ['', '.js', '.json'],
    root: __dirname,
    modulesDirectories: ['node_modules']
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('styles.css')
  ],

  module: {
    loaders: [
      {
        test: '/.js$/',
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
        loader: 'url-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  }
};

// if --production is passed, ng-annotate and uglify the code
if (argv.production) {
  console.info('This might take awhile ...');

  config.plugins.unshift(new webpack.optimize.UglifyJsPlugin({mangle: true}));

  config.plugins.unshift(new NgAnnotatePlugin({add: true}));
}

module.exports = config;
