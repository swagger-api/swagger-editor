'use strict';

PhonicsApp.controller('PreviewCtrl', function PreviewCtrl(Storage, Builder, FoldManager, Sorter, Editor, Operation, $scope) {
  function update(latest) {
    var specs = null;
    var result = null;

    result = Builder.buildDocs(latest, { resolve: true });
    specs = FoldManager.extendSpecs(result.specs);
    $scope.specs = Sorter.sort(specs);

    if (result.error) {
      if (result.error.yamlError) {
        Editor.annotateYAMLErrors(result.error.yamlError);
      } else {
        Editor.clearAnnotation();
      }
      $scope.error = result.error;
      Storage.save('progress', 'Error!');
    } else {
      $scope.error = null;
      Storage.save('progress', 'Saved.');
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
