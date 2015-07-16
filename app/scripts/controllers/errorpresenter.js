'use strict';

SwaggerEditor.controller('ErrorPresenterCtrl', function ErrorPresenterCtrl(
  $scope, $rootScope, Editor, ASTManager) {
  var ERROR_LEVEL = 900;
  var WARNING_LEVEL = 500;

  $scope.isCollapsed = false;

  $scope.getErrors = function () {
    var errors = $scope.$parent.errors || [];
    var warnings = $scope.$parent.warnings;

    if (Array.isArray(errors)) {
      errors = errors.map(function (error) {
        error.level = ERROR_LEVEL;
        return error;
      });
    }

    if (Array.isArray(warnings)) {
      warnings = warnings.map(function (warning) {
        warning.level = WARNING_LEVEL;
        return warning;
      });
      return errors.concat(warnings);
    }

    return errors;
  };

  $scope.getType = function (error) {
    if (error.code && error.message && error.path) {
      if (error.level > 500) {
        return 'Swagger Error';
      }
      return 'Swagger Warning';
    }

    if (error.yamlError) {
      return 'YAML Syntax Error';
    }

    if (error.emptyDocsError) {
      return 'Empty Document Error';
    }

    return 'Unknown Error';
  };

  $scope.getDescription = function (error) {

    if (angular.isString(error.message)) {

      if (angular.isString(error.description)) {
        return error.message + '<br>' + error.description;
      }
      return error.message;
    }

    if (error.emptyDocsError) {
      return error.emptyDocsError.message;
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

  $scope.isOnlyWarnings = function () {
    var errors = $scope.$parent.errors || [];
    var warnings = $scope.$parent.warnings || [];
    return warnings.length && errors.length === 0;
  };

  $scope.getTitle = function () {
    var errors = $scope.$parent.errors || [];
    var warnings = $scope.$parent.warnings || [];

    if (errors.length === 0) {
      if (warnings.length === 0) {
        return 'No Errors or Warnings';
      }
      if (warnings.length === 1) {
        return '1 Warning';
      }
      return warnings.length + ' Warnings';
    }

    if (errors.length === 1) {
      if (warnings.length === 0) {
        return '1 Error';
      }
      if (warnings.length === 1) {
        return '1 Error and 1 Warning';
      }
      return '1 Error and ' + warnings.length + ' Warnings';
    }

    if (warnings.length === 0) {
      return errors.length + ' Errors';
    }
    if (warnings.length === 1) {
      return errors.length + ' Errors and  1 Warning';
    }

    return errors.length + ' Errors and ' + warnings.length + ' Warnings';
  };

  $scope.showLineJumpLink = function (error) {
    return $scope.getLineNumber(error) !== null;
  };

  $scope.getLineNumber = function (error) {
    var line = null;
    if (error.yamlError) {
      line = error.yamlError.mark.line;
    }
    if (error.path) {
      if (error.path.length) {
        line = ASTManager.lineForPath(_.cloneDeep(error.path));
      }
    }
    return line;
  };

  $scope.goToLineOfError = function (error) {
    if (error) {
      Editor.gotoLine($scope.getLineNumber(error));
      Editor.focus();
    }
  };

  $scope.isWarning = function (error) {
    return error.level < ERROR_LEVEL;
  };

  $scope.toggleCollapse = function () {
    $scope.isCollapsed = !$scope.isCollapsed;
  };
});
