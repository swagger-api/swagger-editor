'use strict';

PhonicsApp.controller('ApiDeclarationCtrl',
  [
    '$scope', '$stateParams', '$state', 'getResourceNameFilter',
    function ApiDeclarationCtrl($scope, $stateParams, $state, getResourceName){
      var name = $stateParams.apiDeclaritionId;
      if(Array.isArray($scope.$parent.apiDeclarations)){
        $scope.$parent.apiDeclarations.forEach(function(resource){
          if(getResourceName(resource) === name){
            $scope.apiDeclarations = [resource];
          }
        });
      }else{
        $state.go('home');
      }
    }
  ]
);
