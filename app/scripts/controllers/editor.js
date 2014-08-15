'use strict';

PhonicsApp.controller('EditorCtrl', ['$scope', '$stateParams', 'Editor', 'Builder', 'Storage', EditorCtrl]);

function EditorCtrl($scope, $stateParams, Editor, Builder, Storage) {
  $scope.aceLoaded = Editor.aceLoaded;
  $scope.aceChanged = function(){
    var result;
    var value = Editor.getValue();

    if (!$stateParams.path) {
      result = Builder.buildDocs(value);
    } else {
      result = Builder.updatePath(value, $stateParams.path, Storage.load('specs'));
    }

    Storage.save('specs', result.specs);  
    Storage.save('error', result.error);
  };


  Editor.ready(function () {
    var specs = Storage.load('specs');

    if ($stateParams.path && specs.paths[$stateParams.path]) {
      Editor.setValue(specs.paths[$stateParams.path]);
    } else {
      Editor.setValue(specs);
    }
  });

  $(document).on('pane-resize', Editor.resize.bind(Editor));
}
