'use strict';

PhonicsApp.service('Builder', ['Resolver', 'Validator', Builder]);

function Builder(Resolver, Validator) {
  var load = _.memoize(jsyaml.load);

  function buildDocs(stringValue){

    var json;

    if (!stringValue) {
      return;
    }

    try {
      json = load(stringValue);
    } catch(e) {
      return {
        yamlError: e
      };
    }
    return buildDocsWithObject(json.specs);
  }

  function buildDocsWithObject(json){
    json = Resolver.resolve(json);
    var result = { specs: json };
    var error = Validator.validateSwagger(json);

    if (error && error.swaggerError) {
      result.error = error;
    }

    return result;
  }

  this.buildDocs = buildDocs;
  this.buildDocsWithObject = buildDocsWithObject;
}

