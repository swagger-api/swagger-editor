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
      'wiredep',
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
    'jshint',
    'jscs',
    'karma:unit',
    'protr'
  ]);

  grunt.registerTask('protr', 'Runs end-to-end tests.', [
    'http-server',
    'protractor'
  ]);

  grunt.registerTask('test-dev',
    'Develop unit tests. Continuously runs tests and watches for changes',
    [
      'jshint:test',
      'jscs:test',
      'karma:main',
      'watch:jsTest'
    ]
  );

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'less',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cssmin',
    'uglify',
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
    'shell:publish'
  ]);
};
