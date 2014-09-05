'use strict';

PhonicsApp.controller('MainCtrl', function MainCtrl($rootScope, $stateParams, Editor, Storage, FileLoader, BackendHealthCheck, defaults) {
  $rootScope.$on('$stateChangeStart', Editor.initializeEditor);
  BackendHealthCheck.startChecking();
  $rootScope.$on('$stateChangeStart', loadYaml);
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
      if ($stateParams.url) {
        url = $stateParams.url;

      // If there is no saved YAML either, load the default example
      } else if (!yaml) {
        url = defaults.examplesFolder + defaults.exampleFiles[0];
      }

      if (url) {
        FileLoader.loadFromUrl(url).then(function (yaml) {
          if (yaml) {
            Storage.save('yaml', yaml);
            Editor.setValue(yaml);
          }
        });
      }
    });
  }
});
