/**
 * @prettier
 */

import configBuilder from "./_config-builder"

const result = configBuilder(
  {
    minimize: true,
    mangle: true,
    sourcemaps: true,
    includeDependencies: false,
    emitWorkerAssets: false,
  },
  {
    entry: {
      "swagger-editor": ["./src/index.js"],
    },

    output: {
      library: {
        name: "SwaggerEditorBundle",
        export: "default",
      },
    },

    performance: {
      hints: "error",
      maxEntrypointSize: 1024000, // 1MB
      maxAssetSize: 1024000, // 1MB
    },
  }
)

export default result
