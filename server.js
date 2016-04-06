'use strict';

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var IP = '127.0.0.1';

/*
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
    quiet: true,
    publicPath: config.output.publicPath
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

    // TODO: open browser in development mode

    console.log('Development server started at http://' + IP + ':' + PORT);
  });
}

module.exports = startServer;
