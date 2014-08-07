'use strict';

PhonicsApp.controller('MainCtrl', ['$scope', '$rootScope', 'Editor', 'Storage', MainCtrl]);

function MainCtrl($scope, $rootScope, Editor, Storage) {
  $rootScope.$on('$stateChangeStart', Editor.initializeEditor);

  Editor.ready(function () {
    Editor.setValue(Storage.load());
  });
}
