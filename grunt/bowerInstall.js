module.exports = {
  app: {
    src: ['app/index.html'],
    ignorePath: 'app/'
  },
  sass: {
    src: ['app/styles/{,*/}*.{scss,sass}'],
    ignorePath: 'app/bower_components/'
  }
};
