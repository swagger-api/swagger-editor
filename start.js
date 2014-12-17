'use strict';

var bower = require('bower');
var grunt = require('grunt');

bower.commands
  .install()
  .on('error', function (error) {
    console.error(error)
  })
  .on('end', function () {
    grunt.tasks('serve');
  });
