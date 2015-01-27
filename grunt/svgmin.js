'use strict';

module.exports = {
  dist: {
    files: [{
      expand: true,
      cwd: 'app/images',
      src: '{,*/}*.svg',
      dest: 'dist/images'
    }]
  }
};
