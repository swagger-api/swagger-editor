'use strict';

PhonicsApp.service('Sorter', function Sorter() {
  var XROW = 'x-row';

  this.sort = function (specs) {
    if (specs && specs.paths) {
      var paths = Object.keys(specs.paths).map(function (pathName) {
        if (pathName === XROW) {
          return;
        }
        var path = {
          pathName: pathName,
          operations: sortOperations(specs.paths[pathName])
        };
        path[XROW] = specs.paths[pathName][XROW];

        return path;
      }).sort(function (p1, p2) {
        return p1[XROW] - p2[XROW];
      });

      specs.paths = _.compact(paths);
    }

    return specs;
  };

  function sortOperations(operations) {
    var arr;

    arr = Object.keys(operations).map(function (operationName) {
      if (operationName === XROW) {
        return;
      }

      return {
        operationName: operationName,
        operation: operations[operationName]
      };
    });

    return _.compact(arr);
  }
});
