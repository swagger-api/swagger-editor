/**
 * @prettier
 */

/** Dev Note:
 * StatsWriterPlugin is disabled by default; uncomment to enable
 * when enabled, rebuilding the bundle will cause error for assetSizeLimit,
 * which we want to keep out of CI/CD
 * post build, cli command: npx webpack-bundle-analyzer <path>
 */

import configBuilder from "./_config-builder"
import { DuplicatesPlugin } from "inspectpack/plugin"
import { WebpackBundleSizeAnalyzerPlugin } from "webpack-bundle-size-analyzer"
// import path from "path"
// import { StatsWriterPlugin } from "webpack-stats-plugin"

const result = configBuilder(
  {
    minimize: true,
    mangle: true,
    sourcemaps: true,
    includeDependencies: true,
    emitWorkerAssets: false,
  },
  {
    mode: "production",

    entry: {
      "swagger-editor-bundle": [
        "./src/index.js",
      ],
    },

    output: {
      library: {
        name: "SwaggerEditorBundle",
        export: "default",
      },
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
      new WebpackBundleSizeAnalyzerPlugin("log.bundle-sizes.swagger-editor.txt"),
      // new StatsWriterPlugin({
      //   filename: path.join("log.bundle-stats.swagger-editor.json"),
      //   fields: null,
      // }),
    ]
  }
)

export default result
