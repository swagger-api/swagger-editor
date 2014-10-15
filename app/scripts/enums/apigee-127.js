'use strict';

PhonicsApp.config(function ($provide) {
  $provide.constant('defaults',

  // BEGIN-DEFAUNTAS-JSON
  {
    downloadZipUrl: 'http://generator.wordnik.com/online/api/gen/download/',
    codegen: {
      servers: 'http://generator.wordnik.com/online/api/gen/servers',
      clients: 'http://generator.wordnik.com/online/api/gen/clients',
      server: 'http://generator.wordnik.com/online/api/gen/servers/{language}',
      client: 'http://generator.wordnik.com/online/api/gen/clients/{language}'
    },
    schemaUrl: '/schema/swagger.json',
    exampleFiles: [
      'default.yaml',
      'minimal.yaml',
      'petstore.yaml',
      'heroku-pets.yaml',
      'uber.yaml'
    ],
    backendEndpoint: '/editor/spec',
    backendHelathCheckTimeout: 5000,
    useBackendForStorage: true,
    disableFileMenu: true,
    disableCodeGen: true,
    disableNewUserIntro: true,
    useYamlBackend: true,
    headerBranding: true,
    brandingCssClass: 'apigee-127'
  }
  // END-DEFAULTS-JSON

  );
});
