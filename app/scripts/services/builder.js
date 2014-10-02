'use strict';

PhonicsApp.service('Builder', function Builder(Resolver, Validator) {
  var load = _.memoize(jsyaml.load);

  /**
   * Build spec docs from a string value
   * @param {string} stringValue - the string to make the docs from
   * @returns {object} - Returns a promise that resolves to spec document object
   *  or get rejected because of HTTP failures of external $refs
  */
  function buildDocs(stringValue) {
    var json;

    // If stringVlue is empty, return emptyDocsError
    if (!stringValue) {
      return {
        specs: null,
        error: {emptyDocsError: {message: 'Empty Document'}}
      };
    }

    // if jsyaml is unable to load the string value return yamlError
    try {
      json = load(stringValue);
    } catch (yamlError) {
      return {
        error: { yamlError: yamlError },
        specs: null
      };
    }

    // If stringValue is valid build it
    return buildDocsWithObject(json);
  }

  function buildDocsWithObject(json) {

    return Resolver.resolve(json)
      .then(function onSuccess(resolved) {
        var result = { specs: resolved };
        var error = Validator.validateSwagger(resolved);

        if (error && error.swaggerError) {
          result.error = error;
        }

        return result;
      }, function onFalure(resolveError) {
        return {
          error: { resolveError: resolveError },
          specs: null
        };
      });
  }

  /**
   * Gets a path JSON object and Specs, finds the path in the
   * specs JSON and updates it
   * @param {array} - path an array of keys to reach to an object in JSON structure
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
  this.buildDocsWithObject = buildDocsWithObject;
  this.updatePath = updatePath;
  this.getPath = getPath;
});
