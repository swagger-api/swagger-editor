'use strict';

PhonicsApp.directive('jsonFormatter', ['RecursionHelper', function (RecursionHelper) {
  function link(scope) {
    scope.isArray = function () {
      return Array.isArray(scope.json);
    };

    scope.isObject = scope.json &&
      typeof scope.json === 'object';

    if (scope.isObject) {
      scope.keys = Object.keys(scope.json);
    }

    // If 'open' attribute is present
    scope.isOpen = !!scope.open;

    scope.type = typeof scope.json;
    scope.hasKey = typeof scope.key !== 'undefined';

    scope.escapeString = function (str) {
      return str.replace('"', '\"');
    };

    // Set custom type for null
    if (scope.json === null){
      scope.type = 'null';
    }

    scope.isEmptyObject = function () {
      return scope.keys && !scope.keys.length && scope.isOpen && !scope.isArray();
    };

  }

  return {
    templateUrl: 'templates/json-formatter.html',
    restrict: 'E',
    scope: {
      json: '=',
      key: '=',
      open: '='
    },
    compile: function(element) {

      // Use the compile function from the RecursionHelper,
      // And return the linking function(s) which it returns
      return RecursionHelper.compile(element, link);
    }
  };
}]);
