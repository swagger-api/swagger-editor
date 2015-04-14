'use strict';

var port = process.env.PORT || 9000;

module.exports = {
  options: {
    port: port,
    hostname: 'localhost',
    livereload: 35729
  },
  livereload: {
    options: {
      open: 'http://localhost:' + port,
      base: [
        '.tmp',
        'app'
      ]
    }
  },
  test: {
    options: {
      port: 9001,
      base: [
        '.tmp',
        'test',
        'app'
      ]
    }
  },
  dist: {
    options: {
      keepalive: true,
      base: 'dist',
      port: 80,
      hostname: '0.0.0.0',
      livereload: false
    }
  }
};
