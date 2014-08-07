'use strict';

PhonicsApp.controller('PreviewCtrl', ['Storage', '$scope', PreviewCtrl]);

function PreviewCtrl(Storage, $scope) {
  function update(latest){
    $scope.specs = latest;
  }

  // When stuff in localstorage changes, update
  Storage.addChangeListener(update);

  var stored = Storage.load();
  if (stored) {
    update(stored);
  }
}
