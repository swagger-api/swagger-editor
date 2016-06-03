'use strict';

var _ = require('lodash');

var compose = _.memoize(require('yaml-js/yaml.js').yaml.compose);

/*
 * YAMLWorker bridge and queue
 *
*/
var YAMLWorkerBridge = function() {
  var YAMLWorker = require('scripts/workers/yaml.worker.js');

  this.worker = new YAMLWorker();
  this.queue = [];
  this.worker.onmessage = this.onmessage.bind(this);
  this.worker.onerror = this.onerror.bind(this);
  this.buffer = new Map();
};

[
  'load',
  'loadAll',
  'safeLoad',
  'safeLoadAll',
  'dump',
  'safeDump',
  'scan',
  'parse',
  'compose',
  'compose_all',
  'load_all',
  'emit',
  'serialize',
  'serialize_all',
  'dump_all'
].forEach(function(method) {
  YAMLWorkerBridge.prototype[method] = function(arg, cb) {
    this.queue.push({
      method: method,
      arg: arg,
      cb: cb
    });
    this.enqueue();
  };
});

YAMLWorkerBridge.prototype.enqueue = function() {
  // if queue is empty do nothing.
  if (!this.queue.length) {
    this.currentTask = null;
    return;
  }

  // if there is a currentTask do nothing
  if (this.currentTask) {
    return;
  }

  this.currentTask = this.queue.shift();

  var task = [this.currentTask.method, this.currentTask.arg];
  var taskString = JSON.stringify(task);

  if (this.buffer.has(taskString)) {
    if (this.buffer.get(taskString).error) {
      this.currentTask.cb(this.buffer.get(taskString).error);
    } else {
      this.currentTask.cb(null, this.buffer.get(taskString).result);
    }

    this.currentTask = null;
    this.enqueue();
    return;
  }

  this.worker.postMessage(task);
};

YAMLWorkerBridge.prototype.onmessage = function(message) {
  var task = [this.currentTask.method, this.currentTask.arg];
  var taskString = JSON.stringify(task);

  if (message.data.error) {
    this.buffer.set(taskString, {error: message.data.error});
    this.currentTask.cb(message.data.error);
  } else {
    this.buffer.set(taskString, {result: message.data.result});
    this.currentTask.cb(null, message.data.result);
  }
  this.currentTask = null;
  this.enqueue();
};

YAMLWorkerBridge.prototype.onerror = function(error) {
  this.currentTask.cb(error);
  this.currentTask = null;
  this.enqueue();
};

/*
 * A service for YAMLWorkerBridge to use a single worker for lighter YAML processing
 * work
*/
SwaggerEditor.service('YAML', function YAML() {
  var worker = new YAMLWorkerBridge();

  // expose the methods that are being used
  this.load = worker.load.bind(worker);
  this.dump = worker.dump.bind(worker);

  // Temporarily we are using the main thread to do the composition task due to
  // this bug: https://github.com/connec/yaml-js/issues/17

  this.compose = function(string, cb) {
    try {
      cb(null, compose(string));
    } catch (error) {
      cb(error);
    }
  };
});
