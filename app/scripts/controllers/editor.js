'use strict';

PhonicsApp.controller('EditorCtrl', ['$scope', '$stateParams', 'Editor', 'Builder', 'Storage', EditorCtrl]);

function EditorCtrl($scope, $stateParams, Editor, Builder, Storage) {
  $scope.aceLoaded = Editor.aceLoaded;
  $scope.aceChanged = function(){
    var result;

    if (!$stateParams.path) {
      var value = Editor.getValue();
      result = Builder.buildDocs(value);
    } else {
      // Builder.updatePath(....)
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
