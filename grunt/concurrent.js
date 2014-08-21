module.exports = {
  server: [
    'compass:server'
  ],
  test: [
    'compass'
  ],
  dist: [
    'compass:dist',
    'imagemin',
    'svgmin'
  ]
}
