module.exports = {
  bower: {
    files: ['bower.json'],
    tasks: ['bowerInstall']
  },
  js: {
    files: ['<%= yeoman.app %>/scripts/{,*/}*.js', '<%= yeoman.app %>/libs/{,*/}*.js'],
    tasks: ['newer:jshint:all', 'jscs'],
    options: {
      livereload: true
    }
  },
  html: {
    files: ['<%= yeoman.app %>/**/*.html']
  },
  jsTest: {
    files: ['test/spec/{,*/}*.js'],
    tasks: ['newer:jshint:test', 'karma']
  },
  compass: {
    files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
    tasks: ['compass:server', 'autoprefixer']
  },
  gruntfile: {
    files: ['Gruntfile.js']
  },
  handlebars: {
    files: ['<%= yeoman.app %>/{,*/}*.handlebars', '<%= yeoman.app %>/swagger-ui/main/template/*.handlebars'],
    tasks: ['handlebars:compile']
  },
  livereload: {
    options: {
      livereload: '<%= connect.options.livereload %>'
    },
    files: [
      '<%= yeoman.app %>/{,*/}*.html',
      '<%= yeoman.app %>/{,*/}*.handlebars',
      '.tmp/styles/{,*/}*.css',
      '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
    ]
  }
};
