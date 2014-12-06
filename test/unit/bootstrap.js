$(function () {
  window.$$$defaults$$$ = {
    disableCodeGen: true,
    examplesFolder: '/spec-files/',
    exampleFiles: [
      'default.yaml',
      'heroku-pets.yaml',
      'minimal.yaml',
      'petstore_simple.yaml',
      'petstore_full.yaml',
      'basic-auth.yaml',
      'security.yaml'
    ],
    autocompleteExtension: {},
    useBackendForStorage: false,
    backendEndpoint: '/editor/spec',
    backendHelathCheckTimeout: 5000,
    useYamlBackend: false,
    disableFileMenu: false,
    headerBranding: false,
    enableTryIt: true,
    brandingCssClass: '',
    schemaUrl: '/schema/swagger.json',
    importProxyUrl: 'https://cors-it.herokuapp.com/?url='
  };

  angular.bootstrap(window.document, ['PhonicsApp']);
});
