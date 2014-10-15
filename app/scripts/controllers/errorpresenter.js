'use strict';

PhonicsApp.controller('ErrorPresenterCtrl', function ($scope) {
  $scope.docsMode = false;

  $scope.getError = function () {
    var error = $scope.$parent.error;

    // Don't show empty doc error in editor mode
    if (error && error.emptyDocsError && !$scope.docsMode) {
      return null;
    }

    if (error && error.swaggerError) {
      delete error.swaggerError.stack;
    }

    return error;
  };

  $scope.getType = function () {
    var error = $scope.getError();

    if (error.swaggerError) {
      return 'Swagger Error';
    }

    if (error.yamlError) {
      return 'YAML Syntax Error';
    }

    if (error.resolveError) {
      return 'Resolve Error';
    }

    if (error.emptyDocsError) {
      return 'Empty Document Error';
    }

    return 'Unknown Error';
  };

  $scope.getDescription = function () {
    var error = $scope.getError();

    if (error.emptyDocsError) {
      return error.emptyDocsError.message;
    }

    if (error.swaggerError && angular.isString(error.swaggerError.dataPath)) {

      //TODO: find a badass regex that can handle ' ▹ ' case without 2 replaces
      return error.swaggerError.message +
        ' at\n' + error.swaggerError.dataPath.replace(/\//g, ' ▹ ')
        .replace(' ▹ ', '').replace(/~1/g, '/');
    }

    if (error.yamlError) {
      return error.yamlError.message.replace('JS-YAML: ', '').replace(/./,
        function (a) {
          return a.toUpperCase();
        });
    }

    if (error.resolveError) {
      return error.resolveError;
    }

    return error;
  };

  $scope.getLineNumber = function () {
    var error = $scope.getError();

    if (error && error.yamlError) {
      return error.yamlError.mark.line;
    }

    return -1;
  };

  $scope.showLineJumpLink = function () {
    return $scope.getLineNumber() !== -1;
  };
});
