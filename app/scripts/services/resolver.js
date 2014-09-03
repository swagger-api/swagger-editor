'use strict';

/*
  Resolves YAML $ref references
*/
PhonicsApp.service('Resolver', function Resolver() {
  function resolve(json, root, path) {
    if (!Array.isArray(path)) {
      path = [];
    }
    if (!root) {
      root = json;
    }

    if (Array.isArray(json)) {
      return json.map(function (item) {
        return resolve(item, root);
      });
    }

    if (typeof json !== 'object') {
      return json;
    }

    if (!angular.isObject(json)) {
      throw new Error('Can not resolve ' + path.join(' ▹ '));
    }

    var result = {};
    Object.keys(json).forEach(function (key) {
      if (angular.isObject(json[key]) && json[key].$ref) {
        result[key] = lookup(json[key].$ref, root);
      } else {
        result[key] = resolve(json[key], root, path.concat(key));
      }
    });
    return result;
  }

  function lookup(address, root) {
    if (address.indexOf('#/') !== 0 && address.indexOf('http://') !== 0) {
      address = '#/definitions/' + address;
    }
    var path = address.substring(2).split('/');
    var current = root;
    var key;
    while (path.length) {
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
