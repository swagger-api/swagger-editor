'use strict';

/*
  Keeps track of current document validation
*/
PhonicsApp.service('Validator', ['$http', function Validator($http) {
  var buffer = Object.create(null);

  function checkAgainstJsonSchema(json, schema){
     var isValid = tv4.validate(json, schema);

     if (isValid) {
      return null;
     }

     return tv4.error;
  }

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

  this.validateYamlString = function (string) {
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

}]);
