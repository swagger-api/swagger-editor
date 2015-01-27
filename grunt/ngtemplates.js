'use strict';

module.exports = {
  options: {
    singleQuotes: true,
    bootstrap: function(module, script) {
      return 'angular.module(\'SwaggerEditor\')' +
      '.run([\'$templateCache\', function($templateCache) {' + script + '}]);';
    }
  },
  app: {
    options: {
      htmlmin: '<%= htmlmin.dist %>'
    },
    cwd: 'app',
    src: [
      'templates/**/*.html',
      'views/**/*.html'
    ],
    dest: 'app/scripts/templates.js'
  }
};
