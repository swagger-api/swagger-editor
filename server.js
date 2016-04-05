'use strict';

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var IP = '127.0.0.1';

var PORT = process.env.PORT || 8080;

config.entry.app.unshift('webpack-dev-server/client?http://' + IP + ':' + PORT + '/');

var compiler = webpack(config);

var server = new WebpackDevServer(compiler, {
  progress: true,
  quiet: true,
  publicPath: config.output.publicPath
});

module.exports = server;

if (process.argv[1] === __filename) {
  server.listen(PORT, IP, function(err) {
    if (err) {
      return console.log(err);
    }

    // TODO: open browser in development mode

    console.log('Development server started at http://' + IP + ':' + PORT);
  });
}
