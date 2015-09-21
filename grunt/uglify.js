'use strict';


module.exports = {
  options: {
    screwIE8: true
  },
  sway: {
    files: {
      'dist/bower_components/sway-worker/index.js':
        'app/bower_components/sway-worker/index.js'
    }
  },
  yamlWorker: {
    files: {
      'dist/bower_components/yaml-worker/worker.js': 'app/bower_components/yaml-worker/worker.js',
      'dist/bower_components/yaml-worker/bower_components/yaml-js/yaml.js': 'app/bower_components/yaml-js/yaml.js',
      'dist/bower_components/yaml-worker/bower_components/js-yaml/dist/js-yaml.js': 'app/bower_components/js-yaml/dist/js-yaml.js'
    }
  }
};
