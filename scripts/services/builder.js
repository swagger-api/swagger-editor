'use strict';

var jsyaml = require('js-yaml');
var _ = require('lodash');

SwaggerEditor.service('Builder', function Builder(SwayWorker, Preferences) {
  var load = _.memoize(jsyaml.load);

  /*
   * Build spec docs from a string value
   * @param {string} stringValue - the string to make the docs from
   * @returns {promise} - Returns a promise that resolves to spec document
   *  object or get rejected because of HTTP failures of external $refs
  */
  var buildDocs = function(stringValue) {
    var json;

    return new Promise(function(resolve, reject) {
      // If stringValue is empty, return emptyDocsError
      if (!stringValue) {
        reject({
          specs: null,
          errors: [{emptyDocsError: 'Empty Document Error'}]
        });
      }

      // if jsyaml is unable to load the string value return yamlError
      try {
        json = load(stringValue);
      } catch (yamlError) {
        reject({
          errors: [{yamlError: yamlError}],
          specs: null
        });
      }

      // Add `title` from object key to definitions
      // if they are missing title
      if (json && _.isObject(json.definitions)) {
        for (var definition in json.definitions) {
          if (_.isObject(json.definitions[definition]) &&
              !_.startsWith(definition, 'x-') &&
              _.isEmpty(json.definitions[definition].title)) {
            json.definitions[definition].title = definition;
          }
        }
      }

      SwayWorker.run({
        definition: json,
        jsonRefs: {
          relativeBase: Preferences.get('pointerResolutionBasePath')
        }
      }, function(data) {
        if (data.errors.length) {
          reject(data);
        } else {
          resolve(data);
        }
      });
    });
  };

  this.buildDocs = buildDocs;
});
