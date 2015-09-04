'use strict';

module.exports = {
  options: {
    screwIE8: true,

    // TODO: mangle and compress should be false only for yaml-worker file
    mangle: false,
    compress: false
  },
  sway: {
    files: {
      'dist/bower_components/sway-worker/index.js':
        'app/bower_components/sway-worker/index.js'
    }
  }
};
