'use strict';

PhonicsApp.controller('PreviewCtrl', function PreviewCtrl(Storage, Builder, FoldManager, Sorter, Editor, Operation, BackendHealthCheck, $scope) {
  function update(latest) {

    // If backend is not healthy don't update
    if (!BackendHealthCheck.isHealthy()) {
      return;
    }

    // Error can come in success callback, because of recursive promises
    // So we install same handler for error and success
    Builder.buildDocs(latest).then(onResult, onResult);
  }

  function onResult(result) {
    var specs = FoldManager.extendSpecs(result.specs);
    $scope.specs = Sorter.sort(specs);
    $scope.error = null;
    Editor.clearAnnotation();
    Storage.save('progress',  1); // Saved
    if (result.error) {
      if (result.error.yamlError) {
        Editor.annotateYAMLErrors(result.error.yamlError);
      }
      $scope.error = result.error;
      Storage.save('progress', -1); // Error
    }
  }

  Storage.addChangeListener('yaml', update);

  FoldManager.onFoldStatusChanged(function () {
    _.defer(function () { $scope.$apply(); });
  });
  $scope.toggle = FoldManager.toggleFold;
  $scope.isCollapsed = FoldManager.isFolded;

  $scope.focusEdit = function ($event, line) {
    $event.stopPropagation();
    Editor.gotoLine(line);
  };

  // Add operation service methods directly
  _.extend($scope, Operation);
});
