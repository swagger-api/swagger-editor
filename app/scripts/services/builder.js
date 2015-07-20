'use strict';

SwaggerEditor.service('Builder', function Builder($q) {
  var v2 = SwaggerTools.specs.v2;
  var YAML = new YAMLWorker();

  /**
   * Build spec docs from a string value
   * @param {string} stringValue - the string to make the docs from
   * @returns {promise} - Returns a promise that resolves to spec document
   *  object or get rejected because of HTTP failures of external $refs
  */
  function buildDocs(stringValue) {
    var deferred = $q.defer();

    // If stringVlue is empty, return emptyDocsError
    if (!stringValue) {
      deferred.reject({
        specs: null,
        errors: [{emptyDocsError: 'Empty Document Error'}]
      });

      return deferred.promise;
    }

    YAML.load(stringValue, function (error, json) {

      // if jsyaml is unable to load the string value return yamlError
      if (error) {
        deferred.reject({
          errors: [{yamlError: error}],
          specs: null
        });
        return;
      }

      // Add `title` from object key to definitions
      // if they are missing title
      if (json && angular.isObject(json.definitions)) {

        for (var definition in json.definitions) {

          if (angular.isObject(json.definitions[definition]) &&
              _.isEmpty(json.definitions[definition].title)) {

            json.definitions[definition].title = definition;
          }
        }
      }

      v2.validate(json, function (validationError, validationResults) {
        if (validationError) {
          return deferred.reject({
            specs: json,
            errors: [validationError]
          });
        }

        if (validationResults && validationResults.errors &&
          validationResults.errors.length) {
          return deferred.reject(_.extend({specs: json}, validationResults));
        }  else {
          deferred.resolve(_.extend({specs: json}, validationResults));
        }
      });
    });

    return deferred.promise;
  }

  this.buildDocs = buildDocs;
});
