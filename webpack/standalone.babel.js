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
    emitWorkerAssets: false,
  },
  {
    entry: {
      "swagger-editor-standalone-preset": [
        "./src/standalone/index.js",
      ],
    },

    output: {
      library: "SwaggerEditorStandalonePreset",
    },
  }
)

export default result
