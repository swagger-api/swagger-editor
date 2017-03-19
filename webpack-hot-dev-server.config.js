var path = require('path')

module.exports = require("./make-webpack-config")({
  _special: {
    loaders: {
      'jsx': [ "react-hot-loader", "babel" ]
    },
    separateStylesheets: false,
  },
	devtool: "eval",
  output: {
    pathinfo: true,
    debug: true,
    chunkFilename: "[id].js"
  },
  devServer: {
    port: 3200,
    publicPath: "/" ,
    noInfo: true,
    colors: true,
    stats: {
      colors: true
    },
  },
})
