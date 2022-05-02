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
  {
    test: /\.(txt|yaml)$/,
    type: "asset/source",
  },
  {
    test: /\.(png|jpg|jpeg|gif|svg)$/,
    type: "asset/inline",
  },
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
          inline: emitWorkerAssets ? "fallback" : "no-fallback",
          filename: "[name].js",
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
        library: {
          type: "umd",
        },
      },

      target: "web",

      module: {
        rules: baseRules,
      },

      externals: includeDependencies
        ? {
            esprima: "esprima",
          }
        : ({ request }, cb) => {
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
          brace: path.resolve(projectBasePath, "node_modules", "brace"),
        },
        fallback: {
          path: require.resolve("path-browserify"),
        }
      },

      // If we're mangling, size is a concern -- so use trace-only sourcemaps
      // Otherwise, provide heavy sourcemaps suitable for development
      devtool: sourcemaps
        ? minimize
          ? "nosources-source-map"
          : "cheap-module-source-map"
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
