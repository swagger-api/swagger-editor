'use strict';

var _ = require('lodash');
var angular = require('angular');

SwaggerEditor.controller('UrlImportCtrl', function FileImportCtrl($scope,
  $uibModalInstance, $localStorage, $rootScope, $state, FileLoader, Storage) {
  var results;

  $scope.url = null;
  $scope.error = null;
  $scope.opts = {
    useProxy: true
  };

  var fetch = function(url) {
    $scope.error = null;
    $scope.canImport = false;

    if (_.startsWith(url, 'http')) {
      $scope.fetching = true;
      FileLoader.loadFromUrl(url, !$scope.opts.useProxy).then(function(data) {
        $scope.$apply(function() {
          results = data;
          $scope.canImport = true;
          $scope.fetching = false;
        });
      }).catch(function(error) {
        $scope.$apply(function() {
          $scope.error = error;
          $scope.canImport = false;
          $scope.fetching = false;
        });
      });
    } else {
      $scope.error = 'Invalid URL';
    }
  };

  $scope.fetch = _.throttle(fetch, 200);

  $scope.ok = function() {
    if (angular.isString(results)) {
      Storage.save('yaml', results);
      $rootScope.editorValue = results;
      $state.go('home', {tags: null});
    }
    $uibModalInstance.close();
  };

  $scope.cancel = $uibModalInstance.close;
});
