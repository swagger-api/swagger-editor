'use strict';

PhonicsApp.controller('ImportCtrl', ['$scope', '$modalInstance', 'FileLoader', 'builderHelper', '$localStorage',
  function ImportController($scope, $modalInstance, FileLoader, builder, $localStorage){
  var results;

  $scope.fileChanged = function ($fileContent) {
    results = FileLoader.load($fileContent);
  };

  $scope.ok = function () {
    if(typeof results === 'object') {
      builder.buildDocsWIthObject($scope.$parent, results);
      var yaml = jsyaml.dump(results);
      $localStorage.cache = yaml;
      //editor.getSession().setValue(yaml);
    }
    $modalInstance.close();
  };

  $scope.isInvalidFile = function(){
    return results === null;
  };

  $scope.cancel = $modalInstance.close;
}]);
