'use strict';


function buildapiDeclarationDocs(declraton){
  var swaggerUi = null;
  swaggerUi = new SwaggerUi({
    'dom_id': 'swagger-ui-container-' + Math.floor(Math.random()*100),
    supportedSubmitMethods: ['get', 'post', 'put', 'delete']
  });

  swaggerUi.load(JSON.stringify(declraton));
  return _.clone(swaggerUi.api);
}

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
      $scope.apiDeclarations = json.apiDeclarations.map(buildapiDeclarationDocs);
    }
  }
});
