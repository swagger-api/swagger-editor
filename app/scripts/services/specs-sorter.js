'use strict';

/*
** Uses fold information from FoldManager to re-sort the specs based on
** their position in YAML document. Generated object is using arrays
** instead of hashes to make it possible to keep orders
*/
PhonicsApp.service('SpecsSorter', ['FoldManager', function SpecsSorter(FoldManager) {

  /*
  ** Sort paths, operations and responses based on their fold position
  */
  this.sort = function(specs) {
    var paths = _.clone(specs.paths);
    var results = _.omit(specs, 'paths');
    var pathsArray = [];

    Object.keys(paths).forEach(function (pathName) {
      pathsArray.push({
        pathName: pathName,
        path: paths[pathName]
      });
    });

    pathsArray = pathsArray.sort(pathComparator);

    results.paths = pathsArray;


    /*
    ** Compare two paths based on their fold position
    */
    function pathComparator(pathA, pathB) {
      // TODO
      var rowA = FoldManager.rowFor(pathA);
      var rowB = FoldManager.rowFor(pathB);
      return rowA - rowB;
    }
  };
}]);
