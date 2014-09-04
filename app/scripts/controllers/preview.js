'use strict';

PhonicsApp.controller('PreviewCtrl', function PreviewCtrl(Storage, Builder, FoldManager, Sorter, Editor, Operation, BackendHealthCheck, $scope) {
  function update(latest) {

    // If backend is not healthy don't update
    if (!BackendHealthCheck.isHealthy()) {
      return;
    }

    var specs = null;
    var result = null;

    result = Builder.buildDocs(latest, { resolve: true });
    specs = FoldManager.extendSpecs(result.specs);
    $scope.specs = Sorter.sort(specs);

    if (result.error) {
      if (result.error.yamlError) {
        Editor.annotateYAMLErrors(result.error.yamlError);
      }
      $scope.error = result.error;
      Storage.save('progress', -1); // Error
    } else {
      $scope.error = null;
      Editor.clearAnnotation();
      Storage.save('progress',  1); // Saved
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
