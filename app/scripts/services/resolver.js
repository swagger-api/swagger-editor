'use strict';

/*
  Resolves YAML $ref references
*/
PhonicsApp.service('Resolver', function Resolver() {

  /*
  ** gets a JSON object and recursively resolve all $ref references
  ** root object is being passed to get the actual result of the
  ** $ref reference
  ** path is an array of keys to the current object from root.
  */
  function resolve(json, root, path) {

    // If it's first time resolve is being called there would be no path
    // initialize it
    if (!Array.isArray(path)) {
      path = [];
    }

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

    // Initialize resolved object
    var result = {};

    // For each key in json check if the key is a resolve key ($ref)
    Object.keys(json).forEach(function (key) {
      if (angular.isObject(json[key]) && json[key].$ref) {

        // if it's a resolvable key, look it up and put it in result object
        result[key] = resolve(lookup(json[key].$ref, root), root);
      } else {

        // otherwise recursively resolve it
        result[key] = resolve(json[key], root, path.concat(key));
      }
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
