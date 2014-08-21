// Generated on 2014-05-02 using generator-angular 0.8.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  // require('load-grunt-tasks')(grunt);

  require('load-grunt-config')(grunt);
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks



  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'bowerInstall',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    // 'karma' // TODO
    'http-server',
    'protractor'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'bowerInstall',
    'jscs',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    'cssmin',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('ship', ['gh-pages:main']);
  grunt.registerTask('preview', ['build', 'gh-pages:preview', 'shell:publish-npm']);
  grunt.registerTask('a127', [
    'shell:replace-defaults-a127',
    'build',
    'shell:a127-restore-defaults',
    'shell:pusblish-npm-a127'
  ]);

};
