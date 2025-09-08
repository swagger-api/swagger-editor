import path from 'path';
import webpack from 'webpack';
import { DuplicatesPlugin } from 'inspectpack/plugin/index.js';

import paths from './paths.js';
import configFactory from './webpack.config.js';

const commonConfig = (webpackEnv) => {
  const config = configFactory(webpackEnv);
  const shouldProduceCompactBundle = process.env.REACT_APP_COMPACT_BUNDLE !== 'false';
  const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
  const oneOfRuleIndex = shouldUseSourceMap ? 1 : 0;

  config.output.path = paths.appDist;
  config.output.filename = '[name].js';
  config.output.globalObject = 'globalThis';
  delete config.output.chunkFilename;
  delete config.output.assetModuleFilename;
  config.output.publicPath = '';
  config.experiments = {
    asyncWebAssembly: true,
    syncWebAssembly: true,
  };

  config.optimization.splitChunks = {
    cacheGroups: {
      default: false,
    },
  };
  config.optimization.runtimeChunk = false;

  if (shouldProduceCompactBundle) {
    /**
     * Bundle WASM file directly into JavaScript bundle as data URLs.
     * This configuration reduces the complexity of WASM file loading
     * but increases the overal bundle size.
     */
    config.module.rules[oneOfRuleIndex].oneOf.unshift({
      test: /\.wasm$/,
      type: 'asset/inline',
    });
  } else {
    /**
     * The default way in which webpack loads wasm files won’t work in a worker,
     * so we will have to disable webpack’s default handling of wasm files and
     * then fetch the wasm file by using the file path that we get using file-loader.
     *
     * Resource: https://pspdfkit.com/blog/2020/webassembly-in-a-web-worker/
     */
    config.module.rules[oneOfRuleIndex].oneOf.unshift({
      test: /\.wasm$/,
      loader: 'file-loader',
      type: 'javascript/auto', // this disables webpacks default handling of wasm
    });
  }

  const svgRule = config.module.rules[oneOfRuleIndex].oneOf.find(
    (rule) => String(rule.test) === '/\\.svg$/'
  );
  if (shouldProduceCompactBundle) {
    /**
     * We want all SVG files become part of the bundle.
     */
    svgRule.type = 'asset/inline';
    delete svgRule.use;
  } else {
    svgRule.use[1].options.name = '[name].[hash].[ext]';
  }

  if (shouldProduceCompactBundle) {
    /**
     * We want TTF font from Monaco editor become part of the bundle.
     */
    config.module.rules[oneOfRuleIndex].oneOf.unshift({
      test: /\.ttf$/,
      type: 'asset/inline',
    });
  }

  if (shouldProduceCompactBundle) {
    /**
     * We want HTML files to become part of the bundle.
     */
    config.module.rules[oneOfRuleIndex].oneOf.unshift({
      test: /\.html$/,
      type: 'asset/inline',
    });
  }

  /**
   * We want to have deterministic name for our CSS bundle.
   */
  const miniCssExtractPlugin = config.plugins.find(
    (plugin) => plugin.constructor.name === 'MiniCssExtractPlugin'
  );
  miniCssExtractPlugin.options.filename = 'swagger-editor.css';

  config.plugins = config.plugins.filter(
    (plugin) =>
      ![
        'HtmlWebpackPlugin',
        'InlineChunkHtmlPlugin',
        'InterpolateHtmlPlugin',
        'ReactRefreshWebpackPlugin',
        'WebpackManifestPlugin',
        'WorkboxWebpackPlugin',
      ].includes(plugin.constructor.name)
  );

  config.plugins = [
    ...config.plugins,
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ];

  return config;
};

const swaggerEditorConfig = (webpackEnv) => {
  const config = commonConfig(webpackEnv);

  config.output.libraryTarget = 'umd';
  config.output.library = {
    name: 'SwaggerEditor',
    type: 'umd',
    export: 'default',
  };
  config.externalsType = 'umd';
  config.externals = {
    ...config.externals,
    react: 'React',
  };

  config.entry = {
    'swagger-editor': paths.appIndexJs,
  };

  config.resolve.alias = {
    ...config.resolve.alias,
    'react-is': path.resolve(paths.appNodeModules, 'react-is'),
    dompurify: path.resolve(paths.appNodeModules, 'dompurify'),
    '@babel/runtime': path.resolve(paths.appNodeModules, '@babel', 'runtime'),
  };

  config.plugins = [
    ...config.plugins,
    new DuplicatesPlugin({
      emitErrors: false,
      emitHandler: () => {}, // remove this line to see the actual analysis result
      verbose: false,
      ignoredPackages: ['js-yaml'],
    }),
  ];

  return config;
};

const apidomWorkerConfig = (webpackEnv) => {
  const config = commonConfig(webpackEnv);

  config.entry = {
    'apidom.worker': path.join(paths.appPath, process.env.REACT_APP_APIDOM_WORKER_PATH),
  };

  config.resolve.alias = {
    ...config.resolve.alias,
    'json-schema-traverse': path.resolve(
      paths.appNodeModules,
      '@swagger-api',
      'apidom-ls',
      'node_modules',
      'json-schema-traverse'
    ),
    ajv: path.join(paths.appNodeModules, '@swagger-api', 'apidom-ls', 'node_modules', 'ajv'),
  };

  config.plugins = [
    ...config.plugins,
    new DuplicatesPlugin({
      emitErrors: true,
      verbose: false,
    }),
  ];

  return config;
};

const editorWorkerConfig = (webpackEnv) => {
  const config = commonConfig(webpackEnv);

  config.entry = {
    'editor.worker': path.join(paths.appPath, process.env.REACT_APP_EDITOR_WORKER_PATH),
  };

  config.plugins = [
    ...config.plugins,
    new DuplicatesPlugin({
      emitErrors: true,
      verbose: false,
    }),
  ];

  return config;
};

export default (webpackEnv) => {
  return [
    swaggerEditorConfig(webpackEnv),
    apidomWorkerConfig(webpackEnv),
    editorWorkerConfig(webpackEnv),
  ];
};
