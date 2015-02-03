'use strict';

module.exports = {
  dist: {
    files: [{
      dot: true,
      src: [
        '.tmp',
        'dist/*',
        'app/app/embedded-docs.html'
      ]
    }]
  },
  server: '.tmp'
};
