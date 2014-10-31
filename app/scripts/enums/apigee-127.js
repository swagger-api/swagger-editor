'use strict';

PhonicsApp.config(function ($provide) {
  $provide.constant('defaults',

  // BEGIN-DEFAULTS-JSON
  {
    codegen: {
      servers: 'http://generator.wordnik.com/online/api/gen/servers',
      clients: 'http://generator.wordnik.com/online/api/gen/clients',
      server: 'http://generator.wordnik.com/online/api/gen/servers/{language}',
      client: 'http://generator.wordnik.com/online/api/gen/clients/{language}'
    },
    disableCodeGen: true,

    examplesFolder: '/spec-files/',
    exampleFiles: [
      'default.yaml',
      'minimal.yaml',
      'heroku-pets.yaml',
      'petstore.yaml',
      'security.yaml'
    ],

    autocompleteExtension: {
      'x-a127-config:': Object,
      'x-volos-resources': Object,
      paths: {

      //path
        '.': {

          // operation
          '.': {
            'x-swagger-router-controller': String,
            'x-volos-authorizations': Object,
            'x-volos-apply': Object
          }
        }
      }
    },

    backendEndpoint: '/editor/spec',
    useBackendForStorage: true,
    backendHelathCheckTimeout: 5000,
    useYamlBackend: true,

    disableFileMenu: true,
    headerBranding: true,
    enableTryIt: false,
    brandingCssClass: 'apigee-127',
    schemaUrl: '/schema/swagger.json'
  }
  // END-DEFAULTS-JSON

  );
});
