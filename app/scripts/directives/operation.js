'use strict';

PhonicsApp.directive('operation', ['$timeout', function($timeout){
  // function requiredFieldsAreFilled (operation){
  //   var allRequiredsFilled = true;
  //   operation.parameters.forEach(function(param){
  //     if(param.required && !param.inputValue){
  //       allRequiredsFilled = false;
  //       param.shake =  true;
  //       $timeout(function(){ param.shake = false; }, 900);
  //     }
  //   });
  //   return allRequiredsFilled;
  // }

  // function makeUrl(basePath, path, parameters){
  //   var url = basePath;
  //   var pathParams = {};
  //   var queryParams = {};
  //   parameters.forEach(function(param){
  //     if(param.paramType === 'path'){
  //       pathParams[param.name] = param.inputValue;
  //     }
  //     if(param.paramType === 'query'){
  //       queryParams[param.name] = param.inputValue;
  //     }
  //   });
  //   url += _.template(path)(pathParams);
  //   url += '?' + $.param(queryParams);
  //   return url;
  // }

  // function tryIt(operation, basePath){
  //   if(!requiredFieldsAreFilled(operation)) {
  //     return;
  //   }

  //   var data = operation.parameters.map(function (param){
  //     var o = Object.create(null);
  //     o[param.name] = param.inputValue;
  //     return o;
  //   });
  //   $.ajax({
  //     url: makeUrl(basePath, operation.path, operation.parameters),
  //     method: operation.method,
  //     data: data
  //   }).then(function(result){
  //     console.log(result);
  //   });
  // }
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/operation.html',
    link: function(scope){
      scope.responseCodeClassFor = function (code) {
        switch(~~(+code / 100)){
          case 2: return 'green';
          case 5: return 'red';
          case 4: return 'yellow';
          case 3: return 'blue';
          default: return 'default';
        }
      }
    }
  };
}]);
