'use strict';


function sanetizeSwaggerUiObject (swaggerUi){
  var schema = {

    apisArray: [{
      name: true,
      id: true,

      operationsArray: [{
        method: true,
        parentId: true,
        nickname: true,
        notes: true,
        authorizations: true,
        type: true,
        produces: true,
        parameters: [{
          type: true,
          name: true,
          paramType: true,
          defaultValue: true,
          required: true
        }],
        models: [{
          name: true,
          properties: true
        }]
      }]
    }]
  };

  return _.deepPick(swaggerUi.api, schema);
}

function buildapiDeclarationDocs(declraton){
  var swaggerUi = null;
  swaggerUi = new SwaggerUi({
    'dom_id': 'swagger-ui-container-' + Math.floor(Math.random()*100),
    supportedSubmitMethods: ['get', 'post', 'put', 'delete']
  });

  swaggerUi.load(JSON.stringify(declraton));
  return sanetizeSwaggerUiObject(swaggerUi);
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
      $scope.apiDeclarations = json.apiDeclarations; //.map(buildapiDeclarationDocs);
    }
  }
});
