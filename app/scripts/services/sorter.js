'use strict';

/*
** Because Angular will sort hash keys alphabetically we need to
** translate hashes to arrays in order to keep the order of the
** elements.
*/
SwaggerEditor.service('Sorter', function Sorter() {

  /*
   * Sort spec hash (paths, operations and responses)
   * @param {object} spec
   * @param {object} options - the tag options
   *
   * @returns {object} - sorted spec (paths and operations are arrays)
  */
  function sort(spec, options) {
    var result = _.clone(spec);

    if (spec && spec.paths) {
      var paths = Object.keys(spec.paths).map(function (pathName) {
        if (isVendorExtension(pathName)) {
          return;
        }

        return {
          pathName: pathName,
          pathParameters: spec.paths[pathName].parameters,
          operations: sortOperations(_.clone(spec.paths[pathName]))
            .filter(filterForTags(options.limitToTags))
        };
      });

      // Remove array holes
      result.paths = _.compact(paths);
    }

    return result;
  }

  /*
   * Sort operations
   *
   * @param {object} operations
   * @returns {array}
  */
  function sortOperations(operations) {
    var arr = [];

    if (!angular.isObject(operations)) {
      return arr;
    }

    arr = Object.keys(operations).map(function (operationName) {
      if (isVendorExtension(operationName) ||
          operationName === 'parameters') {
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

  /**
   * Sort responses hash
   * @param  {object} responses
   * @return {array}
   */
  function sortResponses(responses) {
    var arr = [];

    if (!angular.isObject(responses)) {
      return arr;
    }

    arr = Object.keys(responses).map(function (responseName) {
      if (isVendorExtension(responseName)) {
        return;
      }

      var response = _.extend({ responseCode: responseName },
        responses[responseName]);

      return response;
    });

    // Remove array holes
    return _.compact(arr);
  }

  /*
   * Makes a function that filter out operation based on limitToTags array
   *
   * @param limitToTags {array}
   * @return {boolean}
  */
  function filterForTags(limitToTags) {
    return function (operation) {
      if (!limitToTags) {
        return true;
      }
      if (Array.isArray(limitToTags) && Array.isArray(operation.tags)) {
        for (var i = 0; i < limitToTags.length; i++) {
          for (var j = 0; j < operation.tags.length; j++) {
            if (limitToTags[i] === operation.tags[j]) {
              return true;
            }
          }
        }
      }
      return false;
    };
  }

  /**
   * determines if key is vendor extension
   * @param  {string}  key
   * @return {Boolean}
   */
  function isVendorExtension(key) {

    // The standard order property name
    var XDASH = 'x-';

    return _.startsWith(key.toLowerCase(), XDASH);
  }

  this.sort = sort;
});
