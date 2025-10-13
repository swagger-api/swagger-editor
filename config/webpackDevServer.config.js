import fs from 'fs';
import evalSourceMapMiddleware from 'react-dev-utils/evalSourceMapMiddleware.js';
import noopServiceWorkerMiddleware from 'react-dev-utils/noopServiceWorkerMiddleware.js';
import ignoredFiles from 'react-dev-utils/ignoredFiles.js';
import redirectServedPath from 'react-dev-utils/redirectServedPathMiddleware.js';

import paths from './paths.js';
import getHttpsConfig from './getHttpsConfig.js';

const host = process.env.HOST || '0.0.0.0';
const sockHost = process.env.WDS_SOCKET_HOST;
const sockPath = process.env.WDS_SOCKET_PATH; // default: '/ws'
const sockPort = process.env.WDS_SOCKET_PORT;

export default (proxy, allowedHost) => {
  const disableFirewall = !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true';
  const httpsConfig = getHttpsConfig();

  return {
    allowedHosts: disableFirewall ? 'all' : [allowedHost],
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
      webSocketURL: {
        hostname: sockHost,
        pathname: sockPath,
        port: sockPort,
      },
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    devMiddleware: {
      publicPath: paths.publicUrlOrPath.slice(0, -1),
    },

    server: httpsConfig
      ? {
          type: 'https',
          options: httpsConfig,
        }
      : 'http',

    host,
    historyApiFallback: {
      disableDotRule: true,
      index: paths.publicUrlOrPath,
    },
    proxy,
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.use(evalSourceMapMiddleware(devServer));

      if (fs.existsSync(paths.proxySetup)) {
        import(paths.proxySetup).then((proxySetup) => proxySetup.default(devServer.app));
      }

      devServer.app.use(redirectServedPath(paths.publicUrlOrPath));
      devServer.app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));

      return middlewares;
    },
  };
};
