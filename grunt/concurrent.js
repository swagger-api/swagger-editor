module.exports = {
  server: [
    'copy:styles'
  ],
  test: [
    'copy:styles',
  ],
  dist: [
    'copy:ace',
    'copy:styles',
    'imagemin',
    'svgmin'
  ]
};
