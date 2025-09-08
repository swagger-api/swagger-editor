import path from 'path';
import { globbySync } from 'globby';
import nodeExternals from 'webpack-node-externals';

import paths from './paths.js';
import configFactory from './webpack.config.js';

const pluginFiles = globbySync(['plugins/*/index.{js,ts}'], {
  cwd: paths.appSrc,
});
const pluginEntries = pluginFiles.reduce((acc, plugin) => {
  acc[plugin.replace(/\.(js|ts)$/, '')] = path.join(paths.appSrc, plugin);
  return acc;
}, {});
const presetFiles = globbySync(['presets/*/index.{js,ts}'], {
  cwd: paths.appSrc,
});
const presetEntries = presetFiles.reduce((acc, preset) => {
  acc[preset.replace(/\.(js|ts)$/, '')] = path.join(paths.appSrc, preset);
  return acc;
}, {});

export default (webpackEnv) => {
  const config = configFactory(webpackEnv);
  const shouldProduceCompactBundle = process.env.REACT_APP_COMPACT_BUNDLE !== 'false';
  const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
  const oneOfRuleIndex = shouldUseSourceMap ? 1 : 0;

  config.entry = {
    'swagger-editor': paths.appIndexJs,
    ...pluginEntries,
    ...presetEntries,
    'apidom.worker': path.join(paths.appPath, process.env.REACT_APP_APIDOM_WORKER_PATH),
    'editor.worker': path.join(paths.appPath, process.env.REACT_APP_EDITOR_WORKER_PATH),
  };
  config.output.path = paths.appDist;
  config.output.filename = '[name].js';
  config.output.module = true;
  config.output.libraryTarget = 'module';
  config.output.library = {
    type: 'module',
  };
  delete config.output.chunkFilename;
  delete config.output.assetModuleFilename;
  config.output.publicPath = '';
  config.experiments = {
    outputModule: true,
    asyncWebAssembly: true,
    syncWebAssembly: true,
  };
  config.output.environment = {
    module: true,
  };
  config.externalsType = 'module';
  config.externals = [
    config.externals,
    nodeExternals({
      importType: (moduleName) => {
        if (moduleName === '@asyncapi/react-component') {
          /**
           * ideal state: return `import ${moduleName}`;
           * target needs to be set to es2020, but build fails on swagger-ui-react/swagger-ui.css file.
           * Need to find route cause and this will allow to code split the AsyncAPI UI React component.
           */
          return `module ${moduleName}`;
        }
        if (moduleName === 'react/jsx-runtime') {
          return `module ${moduleName}.js`;
        }
        return `module ${moduleName}`;
      },
      allowlist: ['swagger-ui-react/swagger-ui.css'],
    }),
    // Handle plugins as externals
    ({ context, request }, callback) => {
      if (/^plugins\/.+\/index\.js/.test(request)) {
        const requestFullPath = path.resolve(paths.appSrc, request);
        let pluginRelativePath = path.relative(context, requestFullPath);
        if (!pluginRelativePath.startsWith('.')) {
          pluginRelativePath = `./${pluginRelativePath}`;
        }

        return callback(null, pluginRelativePath, 'module');
      }
      return callback();
    },
    // Handle presets as externals
    ({ context, request }, callback) => {
      if (/^presets\/.+\/index\.js/.test(request)) {
        const requestFullPath = path.resolve(paths.appSrc, request);
        let presetRelativePath = path.relative(context, requestFullPath);
        if (!presetRelativePath.startsWith('.')) {
          presetRelativePath = `./${presetRelativePath}`;
        }

        return callback(null, presetRelativePath, 'module');
      }
      return callback();
    },
  ];

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
    delete svgRule.oneOf.splice(0, 1);
  } else {
    svgRule.oneOf[0].use[1].options.name = '[name].[hash].[ext]';
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

  return config;
};
