'use strict';

PhonicsApp.controller('ApiDeclarationCtrl',
  ['$scope', '$stateParams', '$state',
  function ApiDeclarationCtrl($scope ,$stateParams,$state){
    var id = +$stateParams.apiDeclaritionId - 1;
    if($scope.$parent.apiDeclarations[id]){
      $scope.apiDeclarations = [
        $scope.$parent.apiDeclarations[id]
      ];
    }else{
      $state.go('home');
    }
}]);
