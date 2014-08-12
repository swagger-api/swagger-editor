'use strict';

PhonicsApp.controller('PreviewCtrl', ['Storage', '$scope', PreviewCtrl]);

function PreviewCtrl(Storage, $scope) {
  function update(latest){
    $scope.specs = latest && latest.specs;
  }

  // When stuff in localstorage changes, update
  Storage.addChangeListener(update);

  var stored = Storage.load();
  if (stored) {
    update(stored);
  }

  $scope.pathListedStatus = Object.create(null);
  $scope.$watch('specs', function (){
    if ($scope.specs && $scope.specs.paths){
      Object.keys($scope.specs.paths).forEach(function (pathName){
        $scope.pathListedStatus[pathName] = true;
      });
    }
  });

  $scope.setAllPathsListed = function (value){
    for (var pathName in $scope.pathListedStatus) {
      $scope.pathListedStatus[pathName] = value;
    }
  };

  $scope.isPathListed = function (pathName) {
    return $scope.pathListedStatus[pathName];
  };

  $scope.areAllPathsListed = function () {
    return Object.keys($scope.pathListedStatus).reduce(function (memory, pathName) {
      return $scope.pathListedStatus[pathName] && memory;
    }, true);
  };

  $scope.toggleAllPathsListed = function () {
    var allListed = $scope.areAllPathsListed();
    for (var pathName in $scope.pathListedStatus) {
      $scope.pathListedStatus[pathName] = !allListed;
    }
  };
}
