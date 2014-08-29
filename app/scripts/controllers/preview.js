'use strict';

PhonicsApp.controller('PreviewCtrl', function PreviewCtrl(Storage, Builder, FoldManager, Sorter, Editor, Operation, $scope, $stateParams) {
  function updateSpecs(latest) {
    var specs = null;

    if ($stateParams.path) {
      $scope.specs = { paths: Builder.getPath(latest, $stateParams.path) };
      $scope.isSinglePath = true;
    } else {
      specs = Builder.buildDocs(latest, { resolve: true }).specs;
      specs = FoldManager.extendSpecs(specs);
      $scope.specs = Sorter.sort(specs);
    }

    // Update progress status to "Saved"
    Storage.save('progress', 'Saved.');
  }
  function updateError(error) {
    $scope.error = error;

    // Update progress status to "Error" is there is an error
    if (error) {
      Storage.save('progress', 'Error!');
    }
  }

  Storage.addChangeListener('yaml', updateSpecs);
  Storage.addChangeListener('error', updateError);

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
