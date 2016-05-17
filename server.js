'use strict';

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var open = require('open');
var IP = '127.0.0.1';
var argv = require('minimist')(process.argv.slice(2));

/**
 * Start the server with webpack config
 *
 * @param {number} port - TCP port
 * @param {function} cb - Error first success callback
*/
function startServer(port, cb) {
  config.entry.app.unshift('webpack-dev-server/client?http://' + IP + ':' + port + '/');

  var compiler = webpack(config);

  var server = new WebpackDevServer(compiler, {
    progress: true,
    stats: 'errors-only',
    showModules: false,
    publicPath: config.output.publicPath,
    headers: {
      'Set-Cookie':
        'swagger-editor-development-mode:' + Boolean(argv.production) + ';'
    }
  });

  server.listen(port, IP, cb);
}

// if this file was triggered directly, launch the server
if (process.argv[1] === __filename) {
  var PORT = process.env.PORT || 8080;

  startServer(PORT, function(err) {
    if (err) {
      return console.log(err);
    }

    var url = 'http://' + IP + ':' + PORT;

    console.log('Development server started at', url);

    // to avoid opening the browser set DO_NOT_OPEN environment
    // variable to ture
    if (!process.env.DO_NOT_OPEN) {
      console.log('Opening the browser');
      open(url);
    }
  });
}

module.exports = startServer;
