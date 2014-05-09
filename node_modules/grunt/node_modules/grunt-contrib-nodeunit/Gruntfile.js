/*
 * grunt-contrib-nodeunit
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var path = require('path');

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-internal');

  // Whenever the "test" task is run, run some basic tests.
  grunt.registerTask('test', function(which) {
    var test = path.join(__dirname, 'test', 'fixtures', which + '.js');
    if (grunt.file.exists(test)) {
      grunt.config('nodeunit.tests', test);
    }
    grunt.task.run('nodeunit');
  });

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'nodeunit', 'build-contrib']);

};
