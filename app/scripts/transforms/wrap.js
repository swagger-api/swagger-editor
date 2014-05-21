'use strict';

// FIXME how we should generate properties in this object based on document?
PhonicsApp.value('wrap', {
  model: function model(specs) {
    return {
      model: specs,
      apiVersion: '5.0.0-D0',
      swaggerVersion: '1.2',
      authorizations: {
        oauth2:{
          type: 'oauth2',
          scopes:{
            scope: 'write',
            description: 'write to your albums'
          },
          grantTypes:{
            implicit:{
              loginEndpoint:{
                url: 'http://petstore.swagger.wordnik.com/oauth/dialog'
              },
              tokenName: 'access_token'
            }
          }
        }
      }
    };
  },

  opts: function opts(specs){
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
