'use strict';

/*
  Keeps track of current document validation
*/
PhonicsApp.service('Validator', function Validator() {
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
});
