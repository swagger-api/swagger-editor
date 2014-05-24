'use strict';

PhonicsApp.directive('signature', function(){
  function getSampleJSON(type, models) {
    return '{todo: true}';
  }

  function getListType(type){
    if (type && type.indexOf('[') >= 0) {
      return type.substring(type.indexOf('[') + 1, type.indexOf(']'));
    } else {
      return void 0;
    }
  }

  function isPrimitive(type, models){
    return true; //TODO
    var listType = getListType(type);
    if(listType) { type = listType; }
    return typeof models[type] !== 'object';
  }

  function link(scope){
    scope.getSampleJSON = getSampleJSON;
    scope.visibilePane = 0;
    scope.sampleJSON = getSampleJSON(scope.type, scope.models);
    scope.isPrimitive = isPrimitive(scope.type, scope.models);
  }

  return {
    scope: {
      models: '=',
      type: '='
    },
    link: link,
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/signature.html'
  };
});
