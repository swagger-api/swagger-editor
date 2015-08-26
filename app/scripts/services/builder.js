'use strict';

SwaggerEditor.service('Builder', function Builder($q) {
  var load = _.memoize(jsyaml.load);
  var worker = new Worker('bower_components/sway-worker/index.js');

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
        errors: [{emptyDocsError: 'Empty Document Error'}]
      });

      return deferred.promise;
    }

    // if jsyaml is unable to load the string value return yamlError
    try {
      json = load(stringValue);
    } catch (yamlError) {
      deferred.reject({
        errors: [{yamlError: yamlError}],
        specs: null
      });

      return deferred.promise;
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

    worker.postMessage(json);
    worker.onmessage = function(message) {
      if (message.data.errors.length) {
        deferred.reject(message.data);
      } else {
        deferred.resolve(message.data);
      }
    };

    return deferred.promise;
  }

  this.buildDocs = buildDocs;
});
