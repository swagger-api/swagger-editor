'use strict';

PhonicsApp.controller('MainCtrl', ['$scope', '$rootScope', 'Editor', function ($scope, $rootScope, Editor) {
  $scope.invalidDocs = false;
  $scope.emptyDocs = false;
  $rootScope.$on('$stateChangeStart', Editor.initializeEditor);
}]);
