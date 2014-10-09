'use strict';

PhonicsApp.controller('PreviewCtrl', function PreviewCtrl(Storage, Builder, ASTManager,
  Sorter, Editor, Operation, BackendHealthCheck, $scope, $rootScope) {
  function update(latest) {

    // If backend is not healthy don't update
    if (!BackendHealthCheck.isHealthy() && !$rootScope.isPreviewMode) {
      return;
    }

    // Error can come in success callback, because of recursive promises
    // So we install same handler for error and success
    Builder.buildDocs(latest).then(onResult, onResult);
  }

  function onResult(result) {
    $scope.specs = Sorter.sort(result.specs);
    $scope.error = null;
    Storage.save('progress',  1); // Saved

    if (!$rootScope.isPreviewMode) {
      Editor.clearAnnotation();
    }

    if (result.error) {
      if (result.error.yamlError && !$rootScope.isPreviewMode) {
        Editor.annotateYAMLErrors(result.error.yamlError);
      }
      $scope.error = result.error;
      Storage.save('progress', -1); // Error
    }
  }

  Storage.addChangeListener('yaml', update);

  // If app is in preview mode, load the yaml from storage
  if ($rootScope.isPreviewMode) {
    Storage.load('yaml').then(update);
  }

  ASTManager.onFoldStatusChanged(function () {
    _.defer(function () { $scope.$apply(); });
  });
  $scope.toggle = ASTManager.toggleFold;
  $scope.isCollapsed = ASTManager.isFolded;

  /*
   * Focuses editor to a line that represents that path beginning
   * @param path {array} an array of keys into specs structure
   * that points out that specific node
  */
  $scope.focusEdit = function ($event, line) {
    $event.stopPropagation();
    Editor.gotoLine(line);
  };

  // Add operation service methods directly
  _.extend($scope, Operation);
});
