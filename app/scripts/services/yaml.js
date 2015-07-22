'use strict';

/*
 * A service for YAMLWorker to use a single worker for lighter YAML processing
 * work
*/
SwaggerEditor.service('YAML', function YAML() {
  var worker = new YAMLWorker();

  // expose the methods that are being used
  this.load = worker.load.bind(worker);
  this.dump = worker.dump.bind(worker);
  this.compose = worker.compose.bind(worker);
});
