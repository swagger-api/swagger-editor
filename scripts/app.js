'use strict';

window.jQuery = require('jquery');
window.JSONFormatter = require('json-formatter-js');
var angular = require('angular');

// These modules do not export their module name
// json-editor dependency is not in package.json of this package
require('angular-json-schema-form');
require('json-editor');
require('ngstorage');
require('angular-ui-ace');

window.SwaggerEditor = angular.module('SwaggerEditor', [
  require('angular-sanitize'),
  require('ng-file-upload'),
  require('angular-ui-router'),
  require('angular-ui-bootstrap'),
  require('angular-ui-layout'),
  require('angular-marked'),
  require('jsonformatter'),
  'ui.ace',
  'mohsen1.schema-form',
  'ngStorage'
]);

require('scripts/config.js');

// Require all of components
require('scripts/components');

// Bootstrap the app
require('scripts/bootstrap');
