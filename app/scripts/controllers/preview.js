'use strict';

PhonicsApp.controller('PreviewCtrl', ['Storage', '$scope', function (Storage, $scope) {
  function update(latest){
    _.extend($scope,  latest);
  }

  // When stuff in localstorage changes, update
  Storage.addChangeListener(update);

  var stored = Storage.load();
  if (stored) {
    update(stored);
  }

}]);
