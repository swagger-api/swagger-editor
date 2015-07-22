'use strict';

/**
 * Exposes methods for working Abstract Syntax Tree(AST) of YAML/JSON spec
*/
SwaggerEditor.service('ASTManager', function ASTManager() {
  var YAML = new YAMLWorker();

  /**
   * Get a position object with given
   * @param  {string}   yaml
   * YAML or JSON string
   * @param  {array}   path
   * an array of stings that constructs a
   * JSON Path similiar to JSON Pointers(RFC 6901). The difference is, each
   * component of path is an item of the array intead of beinf seperated with
   * slash(/) in a string
   * @param  {Function} cb
   * The callback function the argument will be passed to it will be
   * the position object with `line` and `column` properties
   */
  function positionRangeForPath(yaml, path, cb) {
    // TODO
    cb({line: 0, column: 0});
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
        'properties');
    }

    YAML.compose(yaml, function (error, ast) {
      if (error) {
        console.log('Error composing AST', error);
        return cb([]);
      }

      var path = [];

      find(ast);

      /**
       * recursive find function that finds the node matching the position
       * @param  {object} current - AST object to serach into
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

        var MAP_TAG = 'tag:yaml.org,2002:map';
        var SEQ_TAG = 'tag:yaml.org,2002:seq';
        var i = 0;

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

        if ([MAP_TAG, SEQ_TAG].indexOf(current.tag) === -1) {
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
      }
    });
  }

  this.positionRangeForPath = positionRangeForPath;
  this.pathForPosition = pathForPosition;
});
