/*
 * Renders a JavaScript object as form data
*/

'use strict';

PhonicsApp.filter('formdata', function () {
  return function formdata(object) {
    var result = '';

    if (angular.isObject(object)) {
      Object.keys(object).forEach(function (key) {

        if (angular.isString(object[key])) {
          result += key + ': ' + object[key];
        }
      });
    }

    return result;
  };
});
