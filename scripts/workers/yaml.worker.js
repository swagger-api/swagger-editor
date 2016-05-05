'use strict';

var yaml = require('yaml-js/yaml.js').yaml;
var jsyaml = require('js-yaml');

/**
 * Worker message listener.
 *
 * @param  {object} message Web Workr message object
 *
 * # Message format:
 * `message` is an array. first argument in the array is the method name string
 * and the rest of items are arguments to that method
 */

/* eslint-env worker */
onmessage = function onmessage(message) {
  if (!Array.isArray(message.data) || message.data.length < 2) {
    throw new TypeError('data should be an array with method and arguments');
  }

  var method = message.data[0];
  var args = message.data.slice(1);
  var result = null;
  var error = null;
  var YAML;

  // select YAML engine based on method name
  if (method === 'compose_all' || method === 'compose') {
    YAML = yaml;
  } else {
    YAML = jsyaml;
  }

  if (typeof YAML[method] !== 'function') {
    throw new TypeError('unknown method name');
  }

  try {
    result = YAML[method].apply(null, args);
  } catch (err) {
    error = err;
  }

  postMessage({
    result: result,
    error: error
  });
};
