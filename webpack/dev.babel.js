/**
 * @prettier
 */

import path from "path"
import { HotModuleReplacementPlugin } from "webpack"
import configBuilder from "./_config-builder"
import styleConfig from "./stylesheets.babel"

const devConfig = configBuilder(
  {
    minimize: false,
    mangle: false,
    sourcemaps: true,
    includeDependencies: true,
    includeStyles: true,
    emitWorkerAssets: false,
  },
  {
    mode: "development",
    entry: {
      "swagger-editor-bundle": [
        "./src/index.js",
      ],
      "swagger-editor-standalone-preset": [
        "./src/standalone/index.js",
      ],
      "swagger-editor": "./src/styles/main.less",
    },

    performance: {
      hints: false,
    },

    output: {
      library: "[name]",
      filename: "[name].js",
      chunkFilename: "[id].js",
      globalObject: "this", // HMR breaks WebWorker without this
    },

    devServer: {
      port: 3200,
      publicPath: "/",
      disableHostCheck: true, // for development within VMs
      stats: {
        colors: true,
      },
      hot: true,
      contentBase: path.join(__dirname, "../", "dev-helpers"),
      host: "0.0.0.0",
    },

    plugins: [new HotModuleReplacementPlugin()],
  }
)

// mix in the style config's plugins and loader rules

devConfig.plugins = [...devConfig.plugins, ...styleConfig.plugins]

devConfig.module.rules = [
  ...devConfig.module.rules,
  ...styleConfig.module.rules,
]

export default devConfig
