'use strict';

SwaggerEditor.controller('MainCtrl', function MainCtrl($rootScope, $stateParams,
  $location, Editor, Storage, FileLoader, BackendHealthCheck, defaults,
  Analytics) {

  Analytics.initialize();

  $rootScope.$on('$stateChangeStart', Editor.initializeEditor);

  // if backendHealthCheckTimeout is less than zero, it means it is disabled.
  if (defaults.backendHealthCheckTimeout > 0) {
    BackendHealthCheck.startChecking();
  }

  $rootScope.$on('$stateChangeStart', loadYaml);

  if (!$stateParams.mode) {
    $rootScope.mode = 'edit';
  } else {
    $rootScope.mode = $stateParams.mode;
  }

  // TODO: find a better way to add the branding class (grunt html template)
  $('body').addClass(defaults.brandingCssClass);

  loadYaml();
  /*
  * Load Default or URL YAML
  */
  function loadYaml() {
    Storage.load('yaml').then(function (yaml) {
      var url;

      // If there is a url provided, override the storage with that URL
      if ($stateParams.import) {
        url = $stateParams.import;
        $location.search('import', null);

      // If there is no saved YAML either, load the default example
      } else if (!yaml) {
        url = defaults.examplesFolder + defaults.exampleFiles[0];
      }

      if (url) {
        FileLoader.loadFromUrl(url).then(function (yaml) {
          if (yaml) {
            Storage.save('yaml', yaml);
            $rootScope.editorValue = yaml;
          }
        });
      }
    });
  }
});
