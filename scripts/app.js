'use strict';

window.jQuery = require('jquery');
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

<<<<<<< HEAD
require('./config.js');
=======
SwaggerEditor.config(function(markedProvider) {
  markedProvider.setOptions({
    sanitize: true
  });
});
>>>>>>> 72a0c77a64739f6ae6e7bdd17f01750510090b5a

// Require all of components
require('./components');

// Bootstrap the app
require('./bootstrap');
