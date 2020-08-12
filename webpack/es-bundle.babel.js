/**
 * @prettier
 */

import configBuilder from "./_config-builder"
import path from "path"
import { DuplicatesPlugin } from "inspectpack/plugin"
import { WebpackBundleSizeAnalyzerPlugin } from "webpack-bundle-size-analyzer"
import { StatsWriterPlugin } from "webpack-stats-plugin"

const result = configBuilder(
  {
    minimize: true,
    mangle: true,
    sourcemaps: true,
    includeDependencies: true,
    includeStyles: true,
    emitWorkerAssets: true,
  },
  {
    mode: "production",

    entry: {
      "swagger-editor-bundle-es": [
        "./src/styles/main.less",
        // "./src/polyfills.js",
        "./src/index.js",
      ],
    },

    output: {
      library: "SwaggerEditorBundle",
      libraryTarget: "commonjs2",
    },

    performance: {
      hints: "error",
      maxEntrypointSize: 1024000 * 3.25, // MB
      maxAssetSize: 1024000 * 3.25, // MB
    },

    plugins: [
      new DuplicatesPlugin({
        // emit compilation warning or error? (Default: `false`)
        emitErrors: false,
        // display full duplicates information? (Default: `false`)
        verbose: true,
      }),
      new WebpackBundleSizeAnalyzerPlugin("log.es-bundle-sizes.swagger-editor.txt"),
      new StatsWriterPlugin({
        filename: path.join("log.es-bundle-stats.swagger-editor.json"),
        fields: null,
      }),
    ]
  }
)

export default result
