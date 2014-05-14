'use strict';

PhonicsApp.directive('signature', function(){
  function getSampleJSON(type, models) {
    return SwaggerOperation.prototype.getSampleJSON(type, models);
  };

  function link(scope, element, attributes){
    scope.getSampleJSON = getSampleJSON;
    scope.visibilePane = 0;
    scope.sampleJSON = getSampleJSON(scope.operation.type, scope.models);
    scope.signature = 'stringify';
    scope.model = scope.models[scope.operation.type]
  };

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
