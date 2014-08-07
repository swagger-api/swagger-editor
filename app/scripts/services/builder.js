'use strict';

PhonicsApp.service('Builder', ['Validator', 'Resolver', function Builder(Validator, Resolver) {
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
    if(json && json.paths){
      return json;
    }
    return null;
  }

  this.buildDocs = _.debounce(buildDocs, 300);
  this.buildDocsWIthObject = _.debounce(buildDocsWIthObject, 300);
}]);
