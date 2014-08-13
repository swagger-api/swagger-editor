'use strict';

PhonicsApp.controller('EditorCtrl', ['$scope', '$stateParams', 'Editor', 'Builder', 'Storage', EditorCtrl]);

function EditorCtrl($scope, $stateParams, Editor, Builder, Storage) {
  $scope.aceLoaded = Editor.aceLoaded;
  $scope.aceChanged = function(){
    var value = Editor.getValue();
    var result = Builder.buildDocs(value);

    Storage.save('specs', result.specs);
    Storage.save('error', result.error);
  };

  $(document).on('pane-resize', Editor.resize.bind(Editor));
}
