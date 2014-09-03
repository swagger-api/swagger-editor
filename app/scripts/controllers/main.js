'use strict';

PhonicsApp.controller('MainCtrl', function MainCtrl($rootScope, Editor, Storage, FileLoader, defaults) {
  $rootScope.$on('$stateChangeStart', Editor.initializeEditor);

  // If there is no saved YAML load the default YAML file
  Storage.load('yaml').then(function (yaml) {
    if (!yaml) {
      var url = defaults.examplesFolder + defaults.exampleFiles[0];
      FileLoader.loadFromUrl(url).then(function (yaml) {
        if (yaml) {
          Storage.save('yaml', yaml);
          Editor.setValue(yaml);
        }
      });
    }
  });

  // TODO: find a better way to add the branding class (grunt html template)
  $('body').addClass(defaults.brandingCssClass);
});
