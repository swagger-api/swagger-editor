'use strict';

PhonicsApp.controller('PreviewCtrl', [
  'Storage',
  'Builder',
  'FoldManager',
  '$scope',
  '$stateParams',
  PreviewCtrl
]);

function PreviewCtrl(Storage, Builder, FoldManager, $scope, $stateParams) {
  function updateSpecs(latest) {
    if ($stateParams.path) {
      $scope.specs = { paths: Builder.getPath(latest, $stateParams.path) };
      $scope.isSinglePath = true;
    } else {
      $scope.specs = Builder.buildDocsWithObject(latest, { resolve: true }).specs;
    }
  }
  function updateError(latest) {
    $scope.error = latest;
  }

  Storage.addChangeListener('specs', updateSpecs);
  Storage.addChangeListener('error', updateError);

  Storage.load('specs').then(function (storedSpecs) {
    if (storedSpecs) {
      updateSpecs(storedSpecs);
    }
  });

  Storage.load('error').then(function (storedError) {
    if (storedError) {
      updateError(storedError);
    }
  });


  FoldManager.onFoldStatusChanged(function () {
    _.defer(function () { $scope.$apply(); });
  });

  $scope.getEditPath = function (pathName) {
    return '#/paths?path=' + window.encodeURIComponent(pathName);
  };

  // TODO: Move to a service
  $scope.responseCodeClassFor = function (code) {
    var result = 'default';
    switch (Math.floor(+code / 100)) {
      case 2:
        result = 'green';
        break;
      case 5:
        result = 'red';
        break;
      case 4:
        result = 'yellow';
        break;
      case 3:
        result = 'blue';
    }
    return result;
  };

  $scope.toggle = FoldManager.toggleFold;

  $scope.isCollapsed = FoldManager.isFolded;
}
