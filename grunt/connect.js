module.exports = {
  options: {
    port: 9000,
    // Change this to '0.0.0.0' to access the server from outside.
    hostname: 'localhost',
    livereload: 35729
  },
  livereload: {
    options: {
      open: true,
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
      base: 'dist'
    }
  }
};
