'use strict';

function getResourceAndDescription(apiDeclaration){
  return {
    resourcePath: apiDeclaration.resourcePath,
    description: apiDeclaration.description
  };
}

PhonicsApp.value('wrap', {
  model: function model(specs) {
    return {
      model: {
        apiDeclarations: specs.apiDeclarations,
        apiVersion: specs.apiVersion,
        swaggerVersion: specs.swaggerVersion,
        authorizations: specs.authorizations,
        apis: specs.apiDeclarations.map(getResourceAndDescription),
      }
    };
  },

  opts: function opts(specs){
    // FIXME Swagger Specs should not include opts option
    return _.extend(specs, {
      opts:{
        properties: {
          modelPackage: 'com.reverb.models',
          apiPackage: 'com.reverb.apis',
          groupId: 'com.reverb.swagger',
          artifactId: 'swagger-client',
          artifactVersion: '1.0.0',
        }
      }
    });
  }
});
