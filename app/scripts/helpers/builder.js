'use strict';

PhonicsApp.value('builderHelper', {

  buildDocs: function buildDocs($scope, value){
    var json;

    $scope.invalidDocs = false;
    try {
      json = jsyaml.load(value);
    }catch(e){
      $scope.invalidDocs = true;
      return;
    }
    if(json && Array.isArray(json.apiDeclarations)){
      $scope.apiDeclarations = json.apiDeclarations;
    }
  }
});
