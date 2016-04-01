'use strict';

var $ = require('jquery');

SwaggerEditor.controller('MainCtrl', function MainCtrl(
  $scope, $rootScope, $stateParams, $location,
  Editor, Storage, FileLoader, Analytics, defaults) {
  Analytics.initialize();

  $rootScope.$on('$stateChangeStart', Editor.initializeEditor);

  // find a better way to add the branding class (grunt html template) (to do)
  $('body').addClass(defaults.brandingCssClass);

   /*
   * Assigns the YAML string to editor
   *
   * @param {string} yaml - the Swagger document YAML or JSON
  */
  var assign = function(yaml) {
    if (yaml) {
      Storage.save('yaml', yaml);
      $rootScope.editorValue = yaml;
    }
  };

  /*
  * Load Default or URL YAML
  */
  var loadYaml = function() {
    Storage.load('yaml').then(function(yaml) {
      var url;
      var disableProxy = false;

      // If there is a url provided, override the storage with that URL
      if ($stateParams.import) {
        url = $stateParams.import;
        disableProxy = Boolean($stateParams['no-proxy']);
        $location.search('import', null);
        $location.search('no-proxy', null);

      // If there is no saved YAML either, load the default example
      } else if (!yaml) {
        url = defaults.examplesFolder + defaults.exampleFiles[0];
      }

      if (url) {
        FileLoader.loadFromUrl(url, disableProxy).then(assign);
      }
    });
  };

  loadYaml();

  $rootScope.$on('$stateChangeStart', loadYaml);

  // ----------------------- File drag and drop --------------------------------

  var fileReader = new FileReader();
  $scope.draggedFiles = [];

  // Watch for dropped files and trigger file reader
  $scope.$watch('draggedFiles', function() {
    if ($scope.draggedFiles instanceof File) {
      fileReader.readAsText($scope.draggedFiles, 'utf-8');
    }
  });

  // on reader success load the string
  fileReader.onloadend = function() {
    if (fileReader.result) {
      FileLoader.load(fileReader.result).then(assign);
    }
  };
});
