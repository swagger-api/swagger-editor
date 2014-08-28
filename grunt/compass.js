module.exports = {
  options: {
    sassDir: 'app/styles',
    cssDir: '.tmp/styles',
    generatedImagesDir: '.tmp/images/generated',
    imagesDir: 'app/images',
    javascriptsDir: 'app/scripts',
    fontsDir: 'app/styles/fonts',
    importPath: 'app/bower_components',
    httpImagesPath: '/images',
    httpGeneratedImagesPath: '/images/generated',
    httpFontsPath: '/styles/fonts',
    relativeAssets: false,
    assetCacheBuster: false,
    raw: 'Sass::Script::Number.precision = 10\n'
  },
  server: {
    options: {
      debugInfo: true
    }
  }
};
