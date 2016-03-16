'use strict';

var PORT = 8080; // TODO use env port

var webpackDevServer = require('webpack-dev-server');
var config = require("./webpack.config.js");
config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/");
var compiler = webpack(config);
var server = new webpackDevServer(compiler, {
  publicPath: config.output.publicPath
});

server.listen(8080);
