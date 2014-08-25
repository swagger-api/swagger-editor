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

  $scope.pathListedStatus = Object.create(null);
  $scope.$watch('specs', function () {
    if ($scope.specs && $scope.specs.paths) {
      Object.keys($scope.specs.paths).forEach(function (pathName) {
        if (typeof $scope.pathListedStatus[pathName] === 'undefined') {
          $scope.pathListedStatus[pathName] = !$scope.isSinglePath;
        }
      });
    }
  });

  FoldManager.onFoldStatusChanged(function () {
    _.defer(function () { $scope.$apply(); });
  });

  $scope.getEditPath = function (pathName) {
    return '#/paths?path=' + window.encodeURIComponent(pathName);
  };

  $scope.toggle = FoldManager.toggleFold;

  $scope.isCollapsed = FoldManager.isFolded;
}
