'use strict';

/*
  Keeps track of current document validation
*/
PhonicsApp.service('Validator', function Validator(defaultSchema, defaults,
  $http) {
  var buffer = Object.create(null);
  var latestSchema;

  function getLatestSchema() {
    if (defaults.schemaUrl) {
      $http.get(defaults.schemaUrl).then(function (resp) {
        latestSchema = resp.data;
      });
    }
  }

  this.setStatus = function (status, isValid) {
    buffer[status] = !!isValid;
  };

  this.isValid = function () {
    for (var key in buffer) {
      if (!buffer[key]) {
        return {valid: false, reason: key};
      }
    }
    return {valid: true};
  };

  this.reset = function () {
    buffer = Object.create(null);
  };

  this.validateYamlString = function validateYamlString(string) {
    try {
      jsyaml.load(string);
    } catch (yamlLoadError) {
      var errorMessage = yamlLoadError.message.replace('JS-YAML: ', '');
      return {
        yamlError: {
          message: errorMessage,
          row: yamlLoadError.mark.line,
          column: yamlLoadError.mark.column
        }
      };
    }
    return null;
  };

  this.validateSwagger = function validateSwagger(json, schema) {
    // Refresh Schema for the next time
    getLatestSchema();

    schema = schema || latestSchema || defaultSchema;
    var isValid = tv4.validate(json, schema);

    if (isValid) {
      return null;
    } else {
      return {
        swaggerError: tv4.error
      };
    }

    return tv4.error;
  };
});
