'use strict';

/*
** Because Angular will sort hash keys alphabetically we need to
** translate hashes to arrays in order to keep the order of the
** elements.
** Order information is coming from ASTManager via x-row properties
*/
PhonicsApp.service('Sorter', function Sorter() {

  // The standard order property name
  var XDASH = 'x-';
  var XROW = 'x-row';

  /*
  ** Sort specs hash (paths, operations and responses)
  */
  this.sort = function (specs) {
    if (specs && specs.paths) {
      var paths = Object.keys(specs.paths).map(function (pathName) {
        if (pathName.toLowerCase().substring(0, 2) === XDASH) {
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

      // Remove array holes
      specs.paths = _.compact(paths);
    }

    return specs;
  };

  /*
  ** Sort operations
  */
  function sortOperations(operations) {
    var arr = [];

    if (!angular.isObject(operations)) {
      return arr;
    }

    arr = Object.keys(operations).map(function (operationName) {
      if (operationName.toLowerCase().substring(0, 2) === XDASH) {
        return;
      }

      var operation = {
        operationName: operationName,
        responses: sortResponses(operations[operationName].responses)
      };

      // Remove responses object
      operations[operationName] = _.omit(
        operations[operationName],
        'responses'
      );

      // Add other properties
      _.extend(operation, operations[operationName]);

      return operation;
    }).sort(function (o1, o2) {
      return o1[XROW] - o2[XROW];
    });

    // Remove array holes
    return _.compact(arr);
  }

  function sortResponses(responses) {
    var arr = [];

    if (!angular.isObject(responses)) {
      return arr;
    }

    arr = Object.keys(responses).map(function (responseName) {
      if (responseName.toLowerCase().substring(0, 2) === XDASH) {
        return;
      }

      var response = _.extend({ responseCode: responseName },
        responses[responseName]);

      return response;
    }).sort(function (r1, r2) {
      return r1[XROW] - r2[XROW];
    });

    // Remove array holes
    return _.compact(arr);
  }
});
