var path = require("path")

module.exports = require("./make-webpack-config.js")({
  _special: {
    minimize: false,
    sourcemaps: true,
    separateStylesheets: false,
    loaders: {
      "worker.js": ["worker-loader?inline=true&name=[name].js", "babel"]
    }
  },

  entry: {
    "swagger-editor-bundle": [
      './src/index.js'
    ],
    'swagger-editor-standalone-preset': [
      './src/standalone/index.js'
    ]
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
    publicPath: "/",
    noInfo: true,
    colors: true,
    hot: true,
    stats: {
      colors: true
    },
  }
})
