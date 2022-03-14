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
      // "validator.worker": path.join(projectBasePath, "src", "plugins", "json-schema-validator", "validator.worker.js"),
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

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: [
            path.join(projectBasePath, "src"),
            path.join(projectBasePath, "node_modules", "object-assign-deep"),
          ],
          loader: "babel-loader",
          options: {
            retainLines: true,
            cacheDirectory: true,
          },
        },
        {
          test: /\.(txt|yaml)$/,
          type: "asset/source",
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: "asset/inline",
        },
        {
          test: /\.worker\.js$/,
          use: [
            {
              loader: "worker-loader",
              options: {
                inline: "fallback", // allow to inline as a Blob
                esModule: false,
              },
            },
            "babel-loader",
          ],
        }
      ],
    },
  }
)

export default result
