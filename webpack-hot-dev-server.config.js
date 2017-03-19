var path = require("path")

module.exports = Object.assign(require("./webpack-dist-bundle.config.js"), {
  _special: {
    minimize: false,
    sourcemaps: true,
    separateStylesheets: false,
  },

	devtool: "eval",
  devServer: {
    port: 3200,
    publicPath: "/dist" ,
    noInfo: true,
    colors: true,
    stats: {
      colors: true
    },
  },
})
