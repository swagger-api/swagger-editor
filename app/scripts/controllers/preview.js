'use strict';

PhonicsApp.controller('PreviewCtrl', ['Storage', '$scope', function (Storage, $scope) {

  Storage.addChangeListener(function (latest){
    _.extend($scope,  latest);
  });

}]);
