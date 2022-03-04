/**
 * @prettier
 */

import path from "path"

import configBuilder from "./_config-builder"

const projectBasePath = path.join(__dirname, "../")

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
      "validator.worker": path.join(projectBasePath, "src", "plugins", "json-schema-validator", "validator.worker.js"),
    },

    output: {
      // library: "SwaggerEditorBundle",
      globalObject: "this",
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
