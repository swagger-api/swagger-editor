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
      "./src/polyfills.js",
      './src/index.js'
    ],
    'swagger-editor-standalone-preset': [
      "./src/standalone/styles/main.less",
      "./src/polyfills.js",
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

	devtool: "eval-source-map",
  devServer: {
    port: 3200,
    contentBase: path.join(__dirname, "dev-helpers"),
    publicPath: "/",
    noInfo: true,
    hot: true,
    stats: {
      colors: true
    },
  }
})
