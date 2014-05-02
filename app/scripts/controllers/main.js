'use strict';

angular.module('koknusApp')
  .controller('MainCtrl', function ($scope) {
    $scope.yml = '';
    $scope.editingLanguage = 'yml';

    $scope.aceLoaded = function(editor) {

    };

    $scope.aceChanged = function(e) {
      console.log(e);
    };

    $scope.switchToLanguage = function(language){
      $scope.editingLanguage = language;
    };

  });


