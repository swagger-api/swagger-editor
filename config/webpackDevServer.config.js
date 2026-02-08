import evalSourceMapMiddleware from 'react-dev-utils/evalSourceMapMiddleware.js';
import ignoredFiles from 'react-dev-utils/ignoredFiles.js';
import redirectServedPath from 'react-dev-utils/redirectServedPathMiddleware.js';

import paths from './paths.js';

const webpackDevServerConfig = {
  allowedHosts: 'all',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
  },
  compress: true,
  static: {
    directory: paths.appPublic,
    publicPath: [paths.publicUrlOrPath],
    watch: {
      ignored: ignoredFiles(paths.appSrc),
    },
  },
  client: {
    overlay: {
      errors: true,
      warnings: false,
    },
  },
  devMiddleware: {
    publicPath: paths.publicUrlOrPath.slice(0, -1),
  },
  host: '0.0.0.0',
  historyApiFallback: {
    disableDotRule: true,
    index: paths.publicUrlOrPath,
  },
  setupMiddlewares: (middlewares, devServer) => {
    devServer.app.use(evalSourceMapMiddleware(devServer));
    devServer.app.use(redirectServedPath(paths.publicUrlOrPath));

    return middlewares;
  },
};

export default webpackDevServerConfig;
