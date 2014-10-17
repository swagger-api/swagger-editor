'use strict';

PhonicsApp.service('Builder', function Builder(Schema, Resolver, $q) {
  var load = _.memoize(jsyaml.load);

  /**
   * Build spec docs from a string value
   * @param {string} stringValue - the string to make the docs from
   * @returns {promise} - Returns a promise that resolves to spec document
   *  object or get rejected because of HTTP failures of external $refs
  */
  function buildDocs(stringValue) {
    var json;
    var deferred = $q.defer();

    // If stringVlue is empty, return emptyDocsError
    if (!stringValue) {
      deferred.reject({
        specs: null,
        error: {emptyDocsError: {message: 'Empty Document'}}
      });

      return deferred.promise;
    }

    // if jsyaml is unable to load the string value return yamlError
    try {
      json = load(stringValue);
    } catch (yamlError) {
      deferred.reject({
        error: { yamlError: yamlError },
        specs: null
      });

      return deferred.promise;
    }

    // Add `title` from object key to definitions
    // if they are missing title
    if (json && json.definitions) {
      for (var definition in json.definitions) {
        if (_.isEmpty(json.definitions[definition].title)) {
          json.definitions[definition].title = definition;
        }
      }
    }

    return Resolver.resolve(json).then(

      function onSuccess(resolved) {
        var result = { specs: resolved };
        var deferred = $q.defer();

        var errors = SwaggerTools.specs.v2.validate(json);

        if (!errors) {
          deferred.resolve(result);
        } else {
          result.error = { swaggerError: errors };
          deferred.reject(result);
        }

        return deferred.promise;
      },

      function onFalure(resolveError) {
        return {
          error: {
            resolveError: resolveError.data,
            raw: resolveError
          },
          specs: json
        };
      }
    );
  }

  /**
   * Gets a path JSON object and Specs, finds the path in the
   * specs JSON and updates it
   * @param {array} - path an array of keys to reach to an object in JSON
   *   structure
   * @param {string} - pathName
   * @param {object} - specs
  */
  function updatePath(path, pathName, specs) {
    var json;
    var error = null;

    try {
      json = load(path);
    } catch (e) {
      error = { yamlError: e };
    }

    if (!error) {
      specs.paths[pathName] = json[pathName];
    }

    return {
      specs: specs,
      error: error
    };
  }

  /*
   * Returns one path that matches pathName
   * Returns error object if there is schema incomparability issues
  */
  function getPath(specs, path) {
    return _.pick(specs.paths, path);
  }

  this.buildDocs = buildDocs;
  this.updatePath = updatePath;
  this.getPath = getPath;
});
