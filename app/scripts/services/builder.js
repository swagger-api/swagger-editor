'use strict';

PhonicsApp.service('Builder', ['Resolver', 'Validator', Builder]);

function Builder(Resolver, Validator) {
  var load = _.memoize(jsyaml.load);

  function buildDocs(value){

    var json;

    if (!value) {
      return;
    }

    try {
      json = load(value);
    } catch(e) {
      return null;
    }
    return buildDocsWIthObject(json);
  }

  function buildDocsWIthObject(json){
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
  this.buildDocsWIthObject = buildDocsWIthObject;
}
