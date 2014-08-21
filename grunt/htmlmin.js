module.exports = {
  dist: {
    options: {
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeCommentsFromCDATA: true,
      removeOptionalTags: true
    },
    files: [{
      expand: true,
      cwd: '<%= yeoman.dist %>',
      src: ['*.html', 'views/{,*/}*.html', 'templates/{,*/}*.html'],
      dest: '<%= yeoman.dist %>'
    }]
  }
};
