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
      'compass:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'compass',
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
    'compass',
    'autoprefixer',
    'concat',
    'rev',
    'copy:dist',
    'cssmin',
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
    'shell:publsih-npm-src',
    'gh-pages',
    'shell:publish-npm',
    'a127',
    'shell:squash'
  ]);

  grunt.registerTask('a127', [
    'shell:replace-defaults-a127',
    'build',
    'shell:a127-restore-defaults',
    'shell:pusblish-npm-a127'
  ]);
};
