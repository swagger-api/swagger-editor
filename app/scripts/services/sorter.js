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

  /*
  ** Sort specs hash (paths, operations and responses)
  */
  this.sort = function (specs) {
    if (specs && specs.paths) {
      var paths = Object.keys(specs.paths).map(function (pathName) {
        if (pathName.toLowerCase().substring(0, 2) === XDASH) {
          return;
        }

        return {
          pathName: pathName,
          operations: sortOperations(specs.paths[pathName])
        };
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
    });

    // Remove array holes
    return _.compact(arr);
  }
});
