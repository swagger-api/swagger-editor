'use strict';

/*
  Resolves YAML $ref references
*/
PhonicsApp.service('Resolver', function Resolver() {

  /*
  ** gets a JSON object and recursively resolve all $ref references
  ** root object is being passed to get the actual result of the
  ** $ref reference
  */
  function resolve(json, root) {

    // If it's first time resolve being called root would be the same object
    // as json
    if (!root) {
      root = json;
    }

    // If json is an array, iterate in the array and apply resolve to each element
    // of the array and return it
    if (Array.isArray(json)) {
      return json.map(function (item) {
        return resolve(item, root);
      });
    }

    // if json is not an object we can't resolve it. The json itself is resolved json
    if (!angular.isObject(json)) {
      return json;
    }

    if (json.$ref) {
      return resolve(lookup(json.$ref, root), root);
    }

    // Initialize resolved object
    var result = {};

    // For each key in json check if the key is a resolve key ($ref)
    Object.keys(json).forEach(function (key) {
      result[key] = resolve(json[key], root);
    });

    return result;
  }

  /*
  ** With a given JSON-Schema address and an object (root) returns
  ** the object that $ref address is pointing too
  ** //TODO: resolve HTTP based addresses
  */
  function lookup(address, root) {

    // If address is a shorthand without #definition and not a http address
    // make the address a longhand addrsss
    if (address.indexOf('#/') !== 0 && address.indexOf('http://') !== 0) {
      address = '#/definitions/' + address;
    }

    // Get array of keys to reach to the object
    var path = address.substring(2).split('/');
    var current = root;
    var key;

    // Recursively drill-into the object with array of keys until path is empty
    while (path.length) {
      key = path.shift();

      // If path was invalid and objects at this key is not valid, throw an error
      if (!current[key]) {
        throw new Error('Can not lookup ' + key + ' in ' + angular.toJson(current));
      }
      current = current[key];
    }
    return current;
  }

  // Expose resolve externally
  this.resolve = resolve;
});
