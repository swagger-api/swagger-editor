module.exports = {
  html: '<%= yeoman.app %>/index.html',
  options: {
    dest: '<%= yeoman.dist %>',
    flow: {
      html: {
        steps: {
          js: ['concat', 'uglifyjs'],
          css: ['cssmin']
        },
        post: {}
      }
    }
  }
};
