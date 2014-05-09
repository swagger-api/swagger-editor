/*
 * wiredep
 * https://github.com/stephenplusplus/wiredep
 *
 * Copyright (c) 2013 Stephen Sawchuk
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var glob = require('glob');
var helpers = require('./lib/helpers');
var path = require('path');
var through = require('through2');

/**
 * Wire up the html files with the Bower packages.
 *
 * @param  {object} config  the global configuration object
 */
var wiredep = function (opts) {
  var config = module.exports.config = helpers.createStore();

  config.set
    ('bower.json', opts.bowerJson || JSON.parse(fs.readFileSync('./bower.json')))
    ('bower-directory', opts.directory || 'bower_components')
    ('dependencies', opts.dependencies === false ? false : true)
    ('dev-dependencies', opts.devDependencies)
    ('exclude', opts.exclude)
    ('file-types', opts.fileTypes)
    ('global-dependencies', helpers.createStore())
    ('ignore-path', opts.ignorePath)
    ('src', [])
    ('stream', opts.stream ? opts.stream : {})
    ('warnings', []);

  if (!opts.stream) {
    (Array.isArray(opts.src) ? opts.src : [opts.src]).
      forEach(function (pattern) {
        config.set('src', config.get('src').concat(glob.sync(pattern)));
      });
  }

  require('./lib/detect-dependencies')(config);
  require('./lib/inject-dependencies')(config);

  if (config.get('warnings')) {
    helpers.warn(config.get('warnings'));
  }

  return config.get('stream').src || config.get('src');
};

wiredep.stream = function (opts) {
  opts = opts || {};

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', 'Streaming not supported');
      return cb();
    }

    try {
      opts.stream = {
        src: file.contents.toString(),
        path: file.path,
        fileType: path.extname(file.path).substr(1)
      };

      file.contents = new Buffer(wiredep(opts));
    } catch (err) {
      this.emit('error', err);
    }

    this.push(file);
    cb();
  });
};

module.exports = wiredep;
