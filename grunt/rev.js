'use strict';

module.exports = {
  dist: {
    files: {
      src: [
        'dist/scripts/{,*/}*.js',
        'dist/styles/{,*/}*.css',
        'dist/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
        'dist/styles/fonts/*',
        '!dist/styles/branding.css',
        '!dist/scripts/branding.js'
      ]
    }
  }
};
