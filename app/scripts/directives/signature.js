'use strict';

PhonicsApp.directive('signature', function(){
  function getSampleJSON(type, models) {
    return SwaggerOperation.prototype.getSampleJSON(type, models);
  }

  function link(scope){
    scope.getSampleJSON = getSampleJSON;
    scope.visibilePane = 0;
    scope.sampleJSON = getSampleJSON(scope.operation.type, scope.models);
  }

  return {
    scope: {
      operation: '=',
      models: '='
    },
    link: link,
    restrict: 'E',
    replace: true,
    templateUrl: '/templates/signature.html'
  };
});
