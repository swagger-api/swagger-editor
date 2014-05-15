'use strict';

PhonicsApp.directive('operation', ['$timeout', function($timeout){
  function requiredFieldsAreFilled (operation){
    var allRequiredsFilled = true;
    operation.parameters.forEach(function(param){
      if(param.required && !param.inputValue){
        allRequiredsFilled = false;
        param.shake =  true;
        $timeout(function(){ param.shake = false; }, 900);
      }
    });
    return allRequiredsFilled;
  }

  function tryIt(operation){
    if(!requiredFieldsAreFilled(operation)) {
      return;
    }

    var data = operation.parameters.map(function (param){
      var o = Object.create(null);
      o[param.name] = param.inputValue;
      return o;
    });
    $.ajax({
      method: operation.method,
      data: data
    }).then(function(result){
      console.log(result);
    });
  }
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/operation.html',
    link: function(scope){
      scope.tryIt = tryIt;
    }
  };
}]);
