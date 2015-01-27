'use strict';

module.exports = {
  dist: {
    files: [{
      expand: true,
      cwd: 'app/images',
      src: '{,*/}*.{png,jpg,jpeg,gif}',
      dest: 'dist/images'
    }]
  }
};
