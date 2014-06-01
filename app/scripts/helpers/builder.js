'use strict';


var load = _.memoize(jsyaml.load);

function buildDocs($scope, value){
  var json;

  $scope.invalidDocs = false;
  try {
    json = load(value);
  }catch(e){
    $scope.invalidDocs = true;
    return;
  }
  if(json && Array.isArray(json.apiDeclarations)){
    $scope.apiDeclarations = json.apiDeclarations;
    $scope.$digest();
  }
}

PhonicsApp.value('builderHelper', {
  buildDocs: _.debounce(buildDocs, 300),
});
