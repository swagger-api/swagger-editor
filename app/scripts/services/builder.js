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
      return null;
    }
    return buildDocsWithObject(json);
  }

  function buildDocsWithObject(json){
    json = Resolver.resolve(json);

    var error = Validator.validateSwagger(json);
    if (error && error.swaggerError) {

      // TODO
      console.error(error.swaggerError);
    }
    if(json && json.paths){
      return json;
    }
    return null;
  }

  this.buildDocs = buildDocs;
  this.buildDocsWithObject = buildDocsWithObject;
}

