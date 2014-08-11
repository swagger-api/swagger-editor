'use strict';

PhonicsApp.controller('EditorCtrl', ['$scope', 'Editor', 'Builder', 'Storage', EditorCtrl]);

function EditorCtrl($scope, Editor, Builder, Storage) {
  $scope.editorErrorMessage = '';
  $scope.aceLoaded = Editor.aceLoaded;
  $scope.aceChanged = function(){
    var value = Editor.getValue();
    var specs = Builder.buildDocs(value);

    Storage.save(specs);
  };

  Storage.addChangeListener(function (specs){
    var yaml = jsyaml.dump(specs);
    Editor.setValue(yaml);
  });

  $(document).on('pane-resize', Editor.resize.bind(Editor));
}
