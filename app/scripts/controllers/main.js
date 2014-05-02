'use strict';

angular.module('koknusApp')
  .controller('MainCtrl', function ($scope) {
    $scope.aceLoaded = function(_editor) {
    };

    $scope.aceChanged = function(e) {
      console.log(e);
    };

  });


