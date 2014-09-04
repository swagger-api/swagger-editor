'use strict';

PhonicsApp.config(['$provide', function ($provide) {
  $provide.constant('defaults',

  // BEGIN-DEFAUNTAS-JSON
  {
    downloadZipUrl: 'http://generator.wordnik.com/online/api/gen/download/',
    apiGenUrl: 'http://generator.wordnik.com/online/api/gen/{type}/{kind}',
    examplesFolder: '/spec-files/',
    exampleFiles: ['default.yaml', 'minimal.yaml', 'heroku-pets.yaml', 'uber.yaml'],
    backendEndpoint: '/editor/spec',
    useBackendForStorage: false,
    backendHelathCheckTimeout: 5000,
    disableFileMenu: false,
    useYamlBackend: false,
    headerBranding: false,
    brandingCssClass: ''
  }
  // END-DEFAULTS-JSON

  );
}]);
