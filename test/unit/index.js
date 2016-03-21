'use strict';

var angular = require('angular');
require('angular-json-schema-form'); require('json-editor');
require('ngstorage');
require('angular-ui-ace');

// Define window.SwaggerEditor to have angular-mocks dependency
window.SwaggerEditor = angular.module('SwaggerEditor', [
  require('angular-mocks/ngMock'),
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

// Require app components
require('../../scripts/components');

// Test config
require('./defaults.js');

// Load tests
require('./spec/controllers/editor');



