'use strict';

angular.module('koknusApp')
  .controller('MainCtrl', function ($scope) {
    $scope.editor = null;
    $scope.editingLanguage = 'yml';

    $scope.aceLoaded = function(editor) {
      $scope.editor = editor;
    };

    $scope.aceChanged = function(editor) {
      // TODO
    };

    $scope.switchToLanguage = function(language){
      $scope.editingLanguage = language;
      var currentValue = $scope.editor.getSession().getValue();
      var newValue = null;
      if(language == 'yml'){
        newValue = JSON.parse(currentValue);
        newValue = jsyaml.dump(newValue);
      }
      if(language == 'json'){
        newValue = jsyaml.load(currentValue);
        newValue = JSON.stringify(newValue, null, 2)
      }
      $scope.editor.getSession().setValue(newValue);
    };

  });


