/**
 * @prettier
 */

import path from "path"
import configBuilder from "./_config-builder"

const result = configBuilder(
  {
    minimize: false,
    mangle: false,
    sourcemaps: false,
    includeDependencies: true,
    includeStyles: true,
    emitWorkerAssets: false,
  },
  {
    entry: {
      "swagger-editor-bundle": [
        "./src/styles/main.less",
        "./src/index.js",
      ],
    },

    output: {
      library: "SwaggerEditorBundle",
      path: path.join(
        __dirname,
        require("../package.json").config.deps_check_dir
      ),
    },

    performance: {
      hints: false,
    },
  }
)

export default result
