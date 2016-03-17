'use strict';

var _ = require('lodash');

var compose = _.memoize(require('yaml-js/yaml.js').yaml.compose);
var YAMLWorker = require('yaml-worker');

/*
 * A service for YAMLWorker to use a single worker for lighter YAML processing
 * work
*/
SwaggerEditor.service('YAML', function YAML() {
  var worker = new YAMLWorker('node_modules/yaml-worker/');

  // expose the methods that are being used
  this.load = worker.load.bind(worker);
  this.dump = worker.dump.bind(worker);

  // Temporarily we are using the main thread to do the composition task due to
  // this bug: https://github.com/connec/yaml-js/issues/17

  this.compose = function (string, cb) {
    try {
      cb(null, compose(string));
    } catch (error) {
      cb(error);
    }
  };
});
