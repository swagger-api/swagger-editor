'use strict';

var angular = require('angular');
var $ = require('jquery');
var _ = require('lodash/string');

$(function() {
  // Try bootstrapping the app with embedded defaults if it exists
  var embeddedDefaults = window.$$embeddedDefaults;
  var pathname = window.location.pathname;

  if (!_.endsWith(pathname, '/')) {
    pathname += '/';
  }

  var url = pathname + 'config/defaults.json';

  if (embeddedDefaults) {
    bootstrap(embeddedDefaults);
  } else {
    $.getJSON(url).done(bootstrap).fail(function(error) {
      console.error('Failed to load defaults.json from', url);
      console.error(error);
    });
  }

  /**
   * Bootstrap the application
   * @param {object} defaults - The defaults object
   * @return {undefined}
  */
  function bootstrap(defaults) {
    window.SwaggerEditor.$defaults = defaults;

    SwaggerEditor.run(function($templateCache) {
      // require all templates
      $templateCache.put('templates/about.html',
        require('templates/about.html'));

      $templateCache.put('templates/code-gen-error-modal.html',
        require('templates/code-gen-error-modal.html'));

      $templateCache.put('templates/error-presenter.html',
        require('templates/error-presenter.html'));

      $templateCache.put('templates/file-import.html',
        require('templates/file-import.html'));

      $templateCache.put('templates/import.html',
        require('templates/import.html'));

      $templateCache.put('templates/intro.html',
        require('templates/intro.html'));

      $templateCache.put('templates/open-examples.html',
        require('templates/open-examples.html'));

      $templateCache.put('templates/operation.html',
        require('templates/operation.html'));

      $templateCache.put('templates/paste-json.html',
        require('templates/paste-json.html'));

      $templateCache.put('templates/path.html',
        require('templates/path.html'));

      $templateCache.put('templates/preferences.html',
        require('templates/preferences.html'));

      $templateCache.put('templates/reset-editor.html',
        require('templates/reset-editor.html'));

      $templateCache.put('templates/schema-model.html',
        require('templates/schema-model.html'));

      $templateCache.put('templates/security.html',
        require('templates/security.html'));

      $templateCache.put('templates/specs-info.html',
        require('templates/specs-info.html'));

      $templateCache.put('templates/tags.html',
        require('templates/tags.html'));

      $templateCache.put('templates/try-operation.html',
        require('templates/try-operation.html'));

      $templateCache.put('templates/url-import.html',
        require('templates/url-import.html'));

      $templateCache.put('templates/auth/api-key.html',
        require('templates/auth/api-key.html'));

      $templateCache.put('templates/auth/basic.html',
        require('templates/auth/basic.html'));

      $templateCache.put('templates/auth/oauth2.html',
        require('templates/auth/oauth2.html'));
    });

    angular.bootstrap(window.document, ['SwaggerEditor']);
  }
});
