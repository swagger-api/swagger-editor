/**
 * @prettier
 */

import path from "path"
import os from "os"
import fs from "fs"
import deepExtend from "deep-extend"
import webpack from "webpack"
import TerserPlugin from "terser-webpack-plugin"

import RemoveSourcemapsLackingMatchingAssetsPlugin from "./_RemoveSourcemapsLackingMatchingAssetsPlugin.babel.js"

import { getRepoInfo } from "./_helpers"
import pkg from "../package.json"
const nodeModules = fs.readdirSync("node_modules").filter(function(x) {
  return x !== ".bin"
})

const projectBasePath = path.join(__dirname, "../")

const baseRules = [
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
  { test: /\.(txt|yaml)$/, loader: "raw-loader" },
  {
    test: /\.(png|jpg|jpeg|gif|svg)$/, use: [
      {
        loader: "url-loader",
        options: {
          esModule: false,
        },
      },
    ],
  },
  {
    test: /\.(woff|woff2)$/,
    loader: "url-loader?",
    options: {
      limit: 10000,
    },
  },
  { test: /\.(ttf|eot)$/, loader: "file-loader" },
]

export default function buildConfig(
  {
    minimize = true,
    mangle = true,
    sourcemaps = true,
    includeDependencies = true,
    emitWorkerAssets = false,
  },
  customConfig
) {
  const gitInfo = getRepoInfo()

  const plugins = [
    new webpack.DefinePlugin({
      "process.env.CI": process.env.CI || false,
      buildInfo: JSON.stringify({
        PACKAGE_VERSION: pkg.version,
        GIT_COMMIT: gitInfo.hash,
        GIT_DIRTY: gitInfo.dirty,
        HOSTNAME: os.hostname(),
        BUILD_TIME: new Date().toUTCString(),
      }),
    }),
    new RemoveSourcemapsLackingMatchingAssetsPlugin(),
  ]

  //// Workers

  baseRules.push({
    test: /\.worker\.js$/,
    use: [
      {
        loader: "worker-loader",
        options: {
          inline: true,
          name: "[name].js",
          fallback: !!emitWorkerAssets,
        },
      },
      "babel-loader",
    ],
  })


  const completeConfig = deepExtend(
    {},
    {
      mode: "production",

      entry: {},

      output: {
        path: path.join(projectBasePath, "dist"),
        publicPath: "/dist",
        filename: "[name].js",
        chunkFilename: "[id].[chunkhash].js",
        libraryTarget: "umd",
        libraryExport: "default", // TODO: enable
      },

      target: "web",

      node: {
        // yaml-js has a reference to `fs`, this is a workaround
        fs: "empty",
      },

      module: {
        rules: baseRules,
      },

      externals: includeDependencies
        ? {
            // json-react-schema/deeper depends on buffertools, which fails.
            buffertools: true,
            esprima: true,
          }
        : (context, request, cb) => {
            // webpack injects some stuff into the resulting file,
            // these libs need to be pulled in to keep that working.
            var exceptionsForWebpack = ["ieee754", "base64-js"]
            if (
              nodeModules.indexOf(request) !== -1 ||
              exceptionsForWebpack.indexOf(request) !== -1
            ) {
              cb(null, "commonjs " + request)
              return
            }
            cb()
          },

      resolve: {
        extensions: [".js", ".jsx", "json"],
        alias: {
          react: path.resolve(projectBasePath, "node_modules", "react"),
          "react-dom": path.resolve(projectBasePath, "node_modules", "react-dom"),
          "react-is": path.resolve(projectBasePath, "node_modules", "react-is"),
          "regenerator-runtime": path.resolve(projectBasePath, "node_modules", "@babel", "runtime-corejs3", "node_modules", "regenerator-runtime"),
          "reselect": path.resolve(projectBasePath, "node_modules", "reselect"),
          // this alias avoids bundling the React twice
          "swagger-ui": path.resolve(projectBasePath, "node_modules", "swagger-ui", "dist", "swagger-ui-es-bundle-core.js"),
          brace: path.resolve(projectBasePath, "node_modules", "brace"),
        },
      },

      // If we're mangling, size is a concern -- so use trace-only sourcemaps
      // Otherwise, provide heavy sourcemaps suitable for development
      devtool: sourcemaps
        ? minimize
          ? "nosource-source-map"
          : "module-source-map"
        : false,

      performance: {
        hints: "error",
        maxEntrypointSize: 1024000,
        maxAssetSize: 1024000,
      },

      optimization: {
        minimize: !!minimize,
        minimizer: [
          compiler =>
            new TerserPlugin({
              cache: true,
              sourceMap: sourcemaps,
              terserOptions: {
                mangle: !!mangle,
              },
            }).apply(compiler),
        ],
      },
    },
    customConfig
  )

  // deepExtend mangles Plugin instances, this doesn't
  completeConfig.plugins = plugins.concat(customConfig.plugins || [])

  return completeConfig
}
