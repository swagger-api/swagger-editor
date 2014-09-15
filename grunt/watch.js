module.exports = {
  bower: {
    files: ['bower.json'],
    tasks: ['bowerInstall']
  },
  js: {
    files: ['app/scripts/{,*/}*.js', 'app/libs/{,*/}*.js'],
    tasks: ['newer:jshint:all', 'jscs'],
    options: {
      livereload: true
    }
  },
  html: {
    files: ['app/**/*.html']
  },
  jsTest: {
    files: ['test/spec/{,*/}*.js'],
    tasks: ['newer:jshint:test', 'karma']
  },
  less: {
    files: ['app/styles/{,*/}*.less'],
    tasks: ['less:server', 'autoprefixer']
  },
  gruntfile: {
    files: ['Gruntfile.js']
  },
  handlebars: {
    files: ['app/{,*/}*.handlebars', 'app/swagger-ui/main/template/*.handlebars'],
    tasks: ['handlebars:compile']
  },
  livereload: {
    options: {
      livereload: '<%= connect.options.livereload %>'
    },
    files: [
      'app/{,*/}*.html',
      'app/{,*/}*.handlebars',
      '.tmp/styles/{,*/}*.css',
      'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
    ]
  }
};
