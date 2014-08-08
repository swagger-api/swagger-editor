'use strict';

PhonicsApp.service('Builder', ['Resolver', Builder]);
function Builder(Resolver) {
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

  this.buildDocs = buildDocs;
  this.buildDocsWIthObject = buildDocsWIthObject;
}
