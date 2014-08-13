'use strict';

PhonicsApp.controller('EditorCtrl', ['$scope', 'Editor', 'Builder', 'Storage', EditorCtrl]);

function EditorCtrl($scope, Editor, Builder, Storage) {
  $scope.editorErrorMessage = '';
  $scope.aceLoaded = Editor.aceLoaded;
  $scope.aceChanged = function(){
    var value = Editor.getValue();
    var result = Builder.buildDocs(value);

    Storage.save('specs', result.specs);
    Storage.save('error', result.error);
  };

  $(document).on('pane-resize', Editor.resize.bind(Editor));
}
