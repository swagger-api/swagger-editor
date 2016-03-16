/*
 * Renders a JavaScript object as form data
*/

'use strict';

SwaggerEditor.filter('formdata', function () {
  return function formdata(object) {
    var result = [];

    if (angular.isObject(object)) {
      Object.keys(object).forEach(function (key) {

        if (angular.isDefined(object[key])) {
          result.push(key + ': ' + object[key]);
        }
      });
    }

    return result.join('\n');
  };
});
