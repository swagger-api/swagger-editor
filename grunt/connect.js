'use strict';

module.exports = {
  options: {
    port: 9000,
    hostname: 'localhost',
    livereload: 35729
  },
  livereload: {
    options: {
      open: 'http://localhost:9000/#/edit',
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
      hostname: '0.0.0.0'
    }
  }
};
