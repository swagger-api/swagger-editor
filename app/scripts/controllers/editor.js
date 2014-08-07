'use strict';

PhonicsApp.controller('EditorCtrl', ['$scope', 'Editor', function ($scope, Editor) {
  $scope.editorErrorMessage = '';
  $scope.aceLoaded = Editor.aceLoaded;
  $scope.aceChanged = function(change){
    Editor.aceChanged(change);
  };
  $(document).on('pane-resize', Editor.resize.bind(Editor));
}]);
