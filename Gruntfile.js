'use strict';

module.exports = function (grunt) {

  require('load-grunt-config')(grunt);
  require('time-grunt')(grunt);


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
    'uglify',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('ship', [
    'build',
    'gh-pages',
    'shell:publish-npm'
  ]);

  grunt.registerTask('a127', [
    'shell:replace-defaults-a127',
    'build',
    'shell:a127-restore-defaults',
    'shell:pusblish-npm-a127'
  ]);
};
