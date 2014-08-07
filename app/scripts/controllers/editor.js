'use strict';

PhonicsApp.controller('EditorCtrl', ['$scope', 'Editor', function ($scope, Editor) {
  $scope.editorErrorMessage = '';
  $scope.aceLoaded = Editor.aceLoaded;
  $scope.aceChanged = Editor.aceChanged;
  $(document).on('pane-resize', Editor.resize.bind(editor));
}]);
