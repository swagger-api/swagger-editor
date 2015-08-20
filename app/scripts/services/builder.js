'use strict';

SwaggerEditor.service('Builder', function Builder() {
  var v2 = SwaggerTools.specs.v2;
  var YAML = new YAMLWorker();

  /**
   * Build spec docs from a string value
   * @param {string} stringValue - the string to make the docs from
   * @returns {promise} - Returns a promise that resolves to spec document
   *  object or get rejected because of HTTP failures of external $refs
  */
  function buildDocs(stringValue) {
    return new Promise(function (resolve, reject) {

      // If stringVlue is empty, return emptyDocsError
      if (!stringValue) {
        return reject({
          specs: null,
          errors: [{emptyDocsError: 'Empty Document Error'}]
        });
      }

      YAML.load(stringValue, function (error, json) {

        // if jsyaml is unable to load the string value return yamlError
        if (error) {
          return reject({
            errors: [{yamlError: error}],
            specs: null
          });
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
            return reject({
              specs: json,
              errors: [validationError]
            });
          }

          if (validationResults && validationResults.errors &&
            validationResults.errors.length) {
            return reject(_.extend({specs: json}, validationResults));
          }

          JsonRefs.resolveRefs(json, function (resolveErrors, resolved) {
            if (resolveErrors) {
              return reject({
                errors: [resolveErrors],
                specs: json
              });
            }

            resolve(_.extend({specs: resolved}, validationResults));
          });
        });
      });
    });
  }

  this.buildDocs = buildDocs;
});
