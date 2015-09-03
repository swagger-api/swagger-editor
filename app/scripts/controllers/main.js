'use strict';

SwaggerEditor.controller('MainCtrl', function MainCtrl(
  $scope, $rootScope, $stateParams, $location,
  Editor, Storage, FileLoader, Analytics, defaults) {

  Analytics.initialize();

  $rootScope.$on('$stateChangeStart', Editor.initializeEditor);
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
  }

  /*
   * Assigns the YAML string to editor
   *
   * @param {string} yaml - the Swagger document YAML or JSON
  */
  function assign(yaml) {
    if (yaml) {
      Storage.save('yaml', yaml);
      $rootScope.editorValue = yaml;
    }
  }

  // ----------------------- File drag and drop --------------------------------

  var fileReader = new FileReader();
  $scope.draggedFiles = [];

  // Watch for dropped files and trigger file reader
  $scope.$watch('draggedFiles', function () {
    var file = _.isArray($scope.draggedFiles) && $scope.draggedFiles[0];

    if (file) {
      fileReader.readAsText(file, 'utf-8');
    }
  });

  // on reader success load the string
  fileReader.onloadend = function () {
    if (fileReader.result) {
      FileLoader.load(fileReader.result).then(assign);
    }
  };
});
