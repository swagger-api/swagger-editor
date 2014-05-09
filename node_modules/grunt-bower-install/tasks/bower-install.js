/*
 * grunt-bower.js
 * https://github.com/stephenplusplus/bower-install
 *
 * Copyright (c) 2013 Stephen Sawchuk
 * Licensed under the MIT license.
 */

var path = require('path');
var grunt = require('grunt');
var wiredep = require('wiredep');
var bowerConfig = require('bower-config');


/**
 * Developers may still be using "component.json". That's fine, we can use that
 * just the same. But if they are, we'll let them know it's deprecated.
 *
 * @return {object} bower's .json configuration object
 */
var findBowerJSON = function (cwd) {
  var bowerJSON;
  var config = bowerConfig.read(cwd);

  ['bower.json', 'component.json'].map(function (configFile) {
    return path.join(config.cwd, configFile);
  }).forEach(function (configFile) {
    if (!bowerJSON && grunt.file.isFile(configFile)) {
      bowerJSON = grunt.file.readJSON(configFile);
    }
  });

  return bowerJSON;
};


/**
 * Try to use a `.bowerrc` file to find a custom directory. If it doesn't exist,
 * we're going with "bower_components".
 *
 * @ return {string} the path to the bower component directory
 */
var findBowerDirectory = function (cwd) {
  var config = bowerConfig.read(cwd);
  var directory = path.join(config.cwd, config.directory);

  if (!directory || !grunt.file.isDir(directory)) {
    console.log(
      'Cannot find where you keep your Bower packages.' +
      '\n' +
      '\nWe tried looking for a `.bowerrc` file, but couldn\'t find a custom' +
      '\n`directory` property defined. We then tried `bower_components`, but' +
      '\nit looks like that doesn\'t exist either. As a last resort, we tried' +
      '\nthe pre-1.0 `components` directory, but that also couldn\'t be found.' +
      '\n' +
      '\nUnfortunately, we can\'t proceed without knowing where the Bower' +
      '\npackages you have installed are.' +
      '\n'
    );

    grunt.fail.fatal('No Bower components found.');
  }

  return directory;
};


module.exports = function (grunt) {
  grunt.registerMultiTask('bowerInstall', 'Inject all components in your HTML file.', function () {
    this.requiresConfig(['bowerInstall', this.target, 'src']);

    var cwd = this.data.cwd || '.';

    wiredep({
      bowerJson: findBowerJSON(cwd),
      dependencies: this.data.dependencies === false ? false : true,
      devDependencies: this.data.devDependencies === true ? true : false,
      directory: findBowerDirectory(cwd),
      exclude: this.data.exclude,
      fileTypes: this.data.fileTypes,
      ignorePath: this.data.ignorePath,
      src: grunt.file.expand(this.data.src)
    });
  });
};
