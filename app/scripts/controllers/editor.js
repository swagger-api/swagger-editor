'use strict';

PhonicsApp.controller('EditorCtrl', ['$scope', 'Editor', function ($scope, Editor) {
  $scope.editorErrorMessage = '';
  $scope.aceLoaded = Editor.aceLoaded;
  $scope.aceChanged = Editor.aceChanged;
}]);
