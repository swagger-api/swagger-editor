var path = require("path")
var webpack = require('webpack')


module.exports = require("./make-webpack-config.js")({
  _special: {
    minimize: false,
    sourcemaps: true,
    separateStylesheets: false,
    loaders: {
      "worker.js": ["worker-loader?inline=true&name=[name].js", "babel"]
    }
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'commons' }),
  ],

  entry: {
    "swagger-editor-bundle": [
      './src/index.js'
    ],
    'swagger-editor-standalone-preset': [
      './src/standalone/index.js'
    ],
    'commons': ['react']

  },

  output: {
    pathinfo: true,
    debug: true,
    filename: '[name].js',
    library: "[name]",
    libraryTarget: "umd",
    chunkFilename: "[id].js"
  },

	devtool: "eval",
  devServer: {
    port: 3200,
    path: path.join(__dirname, "dev-helpers"),
    contentBase: path.join(__dirname, "dev-helpers"),
    publicPath: "/",
    noInfo: true,
    colors: true,
    hot: true,
    stats: {
      colors: true
    },
  }
})
