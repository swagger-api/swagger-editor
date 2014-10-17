'use strict';

PhonicsApp.controller('ErrorPresenterCtrl', function ($scope) {
  $scope.docsMode = false;

  $scope.getError = function () {
    var error = $scope.$parent.error;

    // Don't show empty doc error in editor mode
    if (error && error.emptyDocsError && !$scope.docsMode) {
      return null;
    }

    return error;
  };

  $scope.getType = function () {
    var error = $scope.getError();

    if (error.swaggerError && error.swaggerError.errors.length) {
      return 'Swagger Error';
    }

    if (error.swaggerError && !error.swaggerError.errors.length) {
      return 'Swagger Warning';
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

  function stringifySwaggerErrors(errors) {
    return errors.map(function (error) {
      return [
        error.message,
        'at ' + error.path.join(' ▹ ')
      ].join('\n');
    }).join('\n\n');
  }

  $scope.getDescription = function () {
    var error = $scope.getError();

    if (error.emptyDocsError) {
      return error.emptyDocsError.message;
    }

    if (error.swaggerError) {
      if (error.swaggerError.errors.length) {
        return stringifySwaggerErrors(error.swaggerError.errors);
      }

      if (error.swaggerError.warnings.length) {
        return stringifySwaggerErrors(error.swaggerError.warnings);
      }
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

  $scope.getErrorLevel = function () {
    var error = $scope.getError();

    if (error.swaggerError && !error.swaggerError.errors.length) {
      return 'warning';
    }

    return 'error';
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
