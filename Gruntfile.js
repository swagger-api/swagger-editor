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
      'less:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'less',
    'autoprefixer',
    'connect:test',
    'karma',
    'http-server',
    'protractor'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'less',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
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
    'shell:publish-npm',
    'a127',
    'shell:publish-npm-src',
    'shell:squash'
  ]);

  grunt.registerTask('a127', [
    'shell:replace-defaults-a127',
    'build',
    'shell:a127-restore-defaults',
    'shell:publish-npm-a127'
  ]);
};
