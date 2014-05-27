'use strict';

PhonicsApp.value('builderHelper', {

  buildDocs: function buildDocs($scope){
    var json;

    $scope.invalidDocs = false;
    try {
      json = jsyaml.load($scope.editor.getSession().getValue());
    }catch(e){
      $scope.invalidDocs = true;
      return;
    }
    if(json && Array.isArray(json.apiDeclarations)){
      $scope.apiDeclarations = json.apiDeclarations;
    }
  }
});
