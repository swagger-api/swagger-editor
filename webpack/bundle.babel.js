/**
 * @prettier
 */

import configBuilder from "./_config-builder"

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
    entry: {
      "swagger-editor-bundle": [
        "./src/styles/main.less",
        "./src/polyfills.js",
        "./src/index.js",
      ],
    },

    output: {
      library: "SwaggerEditorBundle",
    },

    performance: {
      hints: "error",
      maxEntrypointSize: 1024000 * 3.25, // MB
      maxAssetSize: 1024000 * 3.25, // MB
    },
  }
)

export default result
