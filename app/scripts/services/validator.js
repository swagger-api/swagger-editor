'use strict';

/*
  Keeps track of current document validation
*/
PhonicsApp.service('Validator', ['defaultSchema', Validator]);


function Validator(defaultSchema) {
  var buffer = Object.create(null);

  this.setStatus = function(status, isValid) {
    buffer[status] = !!isValid;
  };

  this.isValid = function() {
    for (var key in buffer) {
      if (!buffer[key]) {
        return {valid: false, reason: key};
      }
    }
    return {valid: true};
  };

  this.reset = function (){
    buffer = Object.create(null);
  };

  this.validateYamlString = function validateYamlString(string) {
    try {
      jsyaml.load(string);
    } catch(yamlLoadError) {
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

  this.validateSwagger = function validateSwagger(json, schema){
    schema = schema || defaultSchema;
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

}
