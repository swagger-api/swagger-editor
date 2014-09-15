module.exports = {
  app: {
    src: ['app/index.html'],
    ignorePath: 'app/'
  },
  less: {
    src: ['app/styles/{,*/}*.less'],
    ignorePath: 'app/bower_components/'
  }
};
