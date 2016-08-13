'use strict';

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var NgAnnotatePlugin = require('ng-annotate-webpack-plugin');
var argv = require('minimist')(process.argv.slice(2));
var FONT_REGEX = /\.(ttf|eot|svg|woff|woff2|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/;

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
    new ExtractTextPlugin('styles.css')
  ],

  eslint: {
    configFile: './.eslintrc.js'
  },

  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.worker.js$/,
        loader: 'worker'
      },
      {
        test: /\.png$/,
        loader: "url",
        query: {mimetype: "image/png"}
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract(
                    'css?sourceMap' +
                    // minimize CSS in producion
                    (argv.production ? '&minimize' : '') +
                    '!less?sourceMap'
        )
      },
      {
        test: /images\/*\.svg$/,
        loader: 'svg-inline'
      },
      {
        test: FONT_REGEX,
        loader: 'url',
        query: {
          // limit: 1000 // 10kb
        }
      },
      // {
      //   test: FONT_REGEX,
      //   loader: 'file'
      // },
      {
        test: /\.html$/,
        loader: 'html'
      }
    ],

    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint'
      }
    ]
  }
};

// if --production is passed, ng-annotate and uglify the code
if (argv.production) {
  console.info('This might take a while...');

  config.plugins.unshift(new webpack.optimize.UglifyJsPlugin({mangle: true}));
  config.plugins.unshift(new NgAnnotatePlugin({add: true}));
  config.plugins.unshift(new webpack.NoErrorsPlugin());
}

module.exports = config;
