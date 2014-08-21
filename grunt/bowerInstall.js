module.exports = {
  app: {
    src: ['<%= yeoman.app %>/index.html'],
    ignorePath: '<%= yeoman.app %>/'
  },
  sass: {
    src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
    ignorePath: '<%= yeoman.app %>/bower_components/'
  }
};
