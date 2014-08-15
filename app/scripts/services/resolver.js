'use strict';

/*
  Resolves YAML $ref references
*/
PhonicsApp.service('Resolver', function Resolver() {
  function resolve(json, root){
    if (!root) {
      root = json;
    }

    if(Array.isArray(json)){
      return json.map(function (item) {
        return resolve(item, root);
      });
    }

    if(typeof json !== 'object'){
      return json;
    }


    var result = {};
    Object.keys(json).forEach(function (key) {
      if(ngular.isObjec(json[key]) && json[key].$ref) {
        result[key] = lookup(json[key].$ref, root);
      } else {
        result[key] = resolve(json[key], root);
      }
    });
    return result;
  }

  function lookup (address, root) {
    if(address.indexOf('#/') !== 0) {
      throw new Error('Can not lookup ' + address + ' in ' + angular.toJson(root));
    }
    var path = address.substring(2).split('/');
    var current = root;
    var key;
    while(path.length){
      key = path.shift();
      if (!current[key]) {
        throw new Error('Can not lookup ' + key + ' in ' + angular.toJson(current));
      }
      current = current[key];
    }
    return current;
  }

  this.resolve = resolve;
});
