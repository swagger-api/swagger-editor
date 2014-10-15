'use strict';

/*
  Resolves YAML $ref references
*/
PhonicsApp.service('Resolver', function Resolver($q, $http) {

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

    // If json is an array, iterate in the array and apply resolve to each
    // element of the array and return it
    if (Array.isArray(json)) {
      return $q.all(json.map(function (item) {
        return resolve(item, root);
      }));
    }

    // if json is not an object we can't resolve it. The json itself is resolved
    // json
    if (!angular.isObject(json)) {
      var deferred = $q.defer();

      deferred.resolve(json);

      return deferred.promise;
    }

    // If there is a `$ref` key in the json object, ignore all other keys and
    // return resolved `$ref`
    if (json.$ref) {
      return lookup(json.$ref, root).then(function (result) {
        return resolve(result, root);
      });
    }

    // Initialize an array of promises of object keys
    var promises = [];

    // For each key in json check if the key is a resolve key ($ref)
    Object.keys(json).forEach(function (key) {
      promises.push(resolve(json[key], root));
    });

    // After getting all promises resolved, rebuild the object from results of
    // resolved promises and Object.keys of the json object. Order of the
    // resolved promises should be the same as Object.keys of the json object
    return $q.all(promises).then(function (resultsArr) {
      var resultObj = {};

      Object.keys(json).forEach(function (key, keyIndex) {
        resultObj[key] = resultsArr[keyIndex];
      });

      return resultObj;
    });

  }

  /**
  * With a given JSON-Schema address and an object (root) returns
  * the object that $ref address is pointing too
  * @param {string} address - The address to lookup
  * @root {object} root - the JSON Schema to lookup in
  * @returns {promise} - Resolves to result of the lookup or get rejected
  *  because of HTTP failures
  */
  function lookup(address, root) {
    var deferred = $q.defer();

    // If it's an http lookup, GET it and resolve to it's data
    if (/^http(s?):\/\//.test(address)) {
      return $http.get(address).then(function (resp) {
        return resp.data;
      });
    }

    // If address is a shorthand without #definition make the address a longhand
    // address
    if (address.indexOf('#/') !== 0) {
      address = '#/definitions/' + address;
    }

    // Get array of keys to reach to the object
    var path = address.substring(2).split('/');
    var current = root;
    var key;

    // Recursively drill-into the object with array of keys until path is empty
    while (path.length) {
      key = path.shift();

      // If path was invalid and objects at this key is not valid, throw an
      // error
      if (!current[key]) {
        deferred.reject({
          data: 'Can not lookup ' + key + ' in ' + angular.toJson(current)
        });
      }
      current = current[key];
    }
    deferred.resolve(current);

    return deferred.promise;
  }

  // Expose resolve externally
  this.resolve = resolve;
});
