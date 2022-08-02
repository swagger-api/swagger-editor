/**
 * @prettier
 */

/**
 * The goal of this config is to mimic the production build setup as close as possible for e2e testing.
 */

import path from "path"
import HtmlWebpackPlugin from "html-webpack-plugin"
import { HtmlWebpackSkipAssetsPlugin } from "html-webpack-skip-assets-plugin"


import configBuilder from "./_config-builder"
import styleConfig from "./stylesheets.babel"

const projectBasePath = path.join(__dirname, "../")
const emitWorkerAssets = false

const e2eConfig = configBuilder(
  {
    minimize: true,
    mangle: true,
    sourcemaps: true,
    includeDependencies: true,
    emitWorkerAssets,
  },
  {
    mode: "production",
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
      filename: "[name].js",
      chunkFilename: "[id].js",
      globalObject: "this",
      library: {
        name: "[name]",
        export: "default",
      },
      publicPath: "/",
    },
    devServer: {
      allowedHosts: "all", // for development within VMs
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      port: 3261,
      host: "0.0.0.0",
      static: {
        directory: path.resolve(projectBasePath, "dev-helpers"),
        publicPath: "/",
      },
      client: {
        logging: "info",
        progress: true,
      },
    },
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: [
            {
              loader: "worker-loader",
              options: {
                inline: emitWorkerAssets ? "fallback" : "no-fallback",
                filename: "[name].js",
              },
            },
            "babel-loader",
          ],
        },
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
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(projectBasePath, "dev-helpers", "index.html"),
        // excludeChunks: ["validator.worker"],
      }),
      new HtmlWebpackSkipAssetsPlugin({
        skipAssets: [/swagger-editor\.js/],
      }),
    ].filter(Boolean),
  }
)
// mix in the style config's plugins and loader rules
e2eConfig.plugins = [...e2eConfig.plugins, ...styleConfig.plugins]
e2eConfig.module.rules = [
  ...e2eConfig.module.rules,
  ...styleConfig.module.rules,
]

export default e2eConfig