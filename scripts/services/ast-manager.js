'use strict';

var _ = require('lodash');

/**
 * Exposes methods for working Abstract Syntax Tree(AST) of YAML/JSON spec
*/
SwaggerEditor.service('ASTManager', function ASTManager(YAML, $log) {
  var MAP_TAG = 'tag:yaml.org,2002:map';
  var SEQ_TAG = 'tag:yaml.org,2002:seq';

  /**
   * Get a position object with given
   *
   * @param  {string}   yaml
   * YAML or JSON string
   * @param  {array}   path
   * an array of stings that constructs a
   * JSON Path similiar to JSON Pointers(RFC 6901). The difference is, each
   * component of path is an item of the array intead of beinf seperated with
   * slash(/) in a string
   *
   * @param {Function} cb - The callback function
   *
   * the argument will be passed to it will be
   * the position object with `start` and `end` properties.
   * `start` or `end` property values each are objects with `line` and `column`
   * properties
   */
  function positionRangeForPath(yaml, path, cb) {
    // Type check
    if (typeof yaml !== 'string') {
      throw new TypeError('yaml should be a string');
    }
    if (!_.isArray(path)) {
      throw new TypeError('path should be an array of strings');
    }
    if (typeof cb !== 'function') {
      throw new TypeError('cb should be a function.');
    }

    var invalidRange = {
      start: {line: -1, column: -1},
      end: {line: -1, column: -1}
    };
    var i = 0;

    YAML.compose(yaml, function(error, ast) {
      // simply walks the tree using current path recursively to the point that
      // path is empty.
      find(ast);

      /**
       * @param {Object} current - object
       * @return {Function} find(value)
      */
      function find(current) {
        if (!current) {
          return cb(invalidRange);
        }
        if (current.tag === MAP_TAG) {
          for (i = 0; i < current.value.length; i++) {
            var pair = current.value[i];
            var key = pair[0];
            var value = pair[1];

            if (key.value === path[0]) {
              path.shift();
              return find(value);
            }
          }
        }

        if (current.tag === SEQ_TAG) {
          var item = current.value[path[0]];

          if (item && item.tag) {
            path.shift();
            find(item);
          }
        }

        // if path is still not empty we were not able to find the node
        if (path.length) {
          return cb(invalidRange);
        }

        return cb({
          /* jshint camelcase: false */
          start: {
            line: current.start_mark.line,
            column: current.start_mark.column
          },
          end: {
            line: current.end_mark.line,
            column: current.end_mark.column
          }
        });
      }
    });
  }

  /**
   * Get a JSON Path for position object in the spec
   * @param  {string} yaml
   * YAML or JSON string
   * @param  {object} position
   * position in the YAML or JSON string with `line` and `column` properties.
   * `line` and `column` number are zero indexed
   * @param {Function} cb
   * the callback function that resolves to an array of stings that constructs a
   * JSON Path similiar to JSON Pointers(RFC 6901). The difference is, each
   * component of path is an item of the array intead of beinf seperated with
   * slash(/) in a string
  */
  function pathForPosition(yaml, position, cb) {
    // Type check
    if (typeof yaml !== 'string') {
      throw new TypeError('yaml should be a string');
    }
    if (typeof position !== 'object' || typeof position.line !== 'number' ||
      typeof position.column !== 'number') {
      throw new TypeError('position should be an object with line and column' +
        ' properties');
    }
    if (typeof cb !== 'function') {
      throw new TypeError('cb should be a function.');
    }

    YAML.compose(yaml, function(error, ast) {
      if (error) {
        $log.log('Error composing AST', error);
        return cb([]);
      }

      var path = [];

      find(ast);

      /**
       * Recursive find function that finds the node matching the position
       *
       * @param {object} current - AST object to serach into
       *
       * @return {undefined}
      */
      function find(current) {
        // algorythm:
        // is current a promitive?
        //   // finish recursion without modifying the path
        // is current a hash?
        //   // find a key or value that position is in their range
        //     // if key is in range, terminate recursion with exisiting path
        //     // if a value is in range push the corresponding key to the path
        //     //   andcontinue recursion
        // is current an array
        //   // find the item that position is in it's range and push the index
        //   //  of the item to the path and continue recursion with that item.

        var i = 0;

        if (!current || [MAP_TAG, SEQ_TAG].indexOf(current.tag) === -1) {
          return cb(path);
        }

        if (current.tag === MAP_TAG) {
          for (i = 0; i < current.value.length; i++) {
            var pair = current.value[i];
            var key = pair[0];
            var value = pair[1];

            if (isInRange(key)) {
              return cb(path);
            } else if (isInRange(value)) {
              path.push(key.value);
              return find(value);
            }
          }
        }

        if (current.tag === SEQ_TAG) {
          for (i = 0; i < current.value.length; i++) {
            var item = current.value[i];

            if (isInRange(item)) {
              path.push(i.toString());
              return find(item);
            }
          }
        }

        return cb(path);

        /**
         * Determines if position is in node's range
         * @param  {object}  node - AST node
         * @return {Boolean}      true if position is in node's range
         */
        function isInRange(node) {
          /* jshint camelcase: false */

          // if node is in a single line
          if (node.start_mark.line === node.end_mark.line) {
            return (position.line === node.start_mark.line) &&
              (node.start_mark.column <= position.column) &&
              (node.end_mark.column >= position.column);
          }

          // if position is in the same line as start_mark
          if (position.line === node.start_mark.line) {
            return position.column >= node.start_mark.column;
          }

          // if position is in the same line as end_mark
          if (position.line === node.end_mark.line) {
            return position.column <= node.end_mark.column;
          }

          // if position is between start and end lines return true, otherwise
          // return false.
          return (node.start_mark.line < position.line) &&
            (node.end_mark.line > position.line);
        }
      }
    });
  }

  // Expose promisified version of methods
  this.positionRangeForPath = function positionRangeForPathPromise(yaml, path) {
    return (new Promise(function(resolve) {
      positionRangeForPath(yaml, path, resolve);
    })).catch(function(error) {
      $log.error('positionRangeForPath error:', error);
    });
  };

  this.pathForPosition = function pathForPositionPromise(yaml, position) {
    return (new Promise(function(resolve) {
      pathForPosition(yaml, position, resolve);
    })).catch(function(error) {
      $log.error('pathForPosition error:', error);
    });
  };
});
