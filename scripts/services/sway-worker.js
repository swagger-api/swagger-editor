'use strict';

/*
 * A simple queue for maintaining order of execution and accurate callback
 * calling for worker tasks
 *
*/
SwaggerEditor.service('SwayWorker', function SwayWorker() {
  var SwayWorker = require('scripts/workers/sway.worker.js');
  var worker = new SwayWorker();
  var queue = [];
  var currentTask = null;

  worker.onmessage = onMessage;
  worker.onerror = onError;

  /**
   * Schedule a task for the worker
   *
   * @param {obj} arg - the task arguments
   *
   * @param {function} cb - completion callback
  */
  function schedule(arg, cb) {
    queue.push({
      arg: arg,
      cb: cb
    });
    enqueue();
  }

  /**
   * Enqueue a task from task list and invoke it
   *
   * @private
  */
  function enqueue() {
    // if queue is empty do nothing.
    if (!queue.length) {
      return;
    }

    // if there is a currentTask do nothing
    if (currentTask) {
      return;
    }

    currentTask = queue.shift();
    worker.postMessage(currentTask.arg);
  }

  /**
   * Respond to worker successful executions
   *
   * @private
   * @param {Message} message - a web worker message
  */
  function onMessage(message) {
    if (currentTask) {
      currentTask.cb(message.data);
    }
    currentTask = null;
    enqueue();
  }

  /**
   * Respond to worker failed executions
   *
   * @private
   * @param {Message} message - a web worker message
   * @throws {Error}
  */
  function onError(message) {
    if (currentTask) {
      currentTask.cb(message.data);
    }
    currentTask = null;
    enqueue();
  }

  // expose only the schedule method
  this.run = schedule;
});
