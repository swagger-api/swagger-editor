'use strict';

SwaggerEditor.controller('ErrorPresenterCtrl', function ErrorPresenterCtrl(
  $scope, $rootScope, Editor, ASTManager) {
  var ERROR_LEVEL = 900;
  var WARNING_LEVEL = 500;

  $scope.isCollapsed = false;

  if (!_.isArray($scope.$parent.errors)) {
    $scope.$parent.errors = [];
  }
  if (!_.isArray($scope.$parent.warnings)) {
    $scope.$parent.warnings = [];
  }

  var errorsAndWarnings = $scope.$parent.errors.map(function (error) {
    error.level = ERROR_LEVEL;
    return error;
  }).concat($scope.$parent.warnings.map(function (warning) {
    warning.level = WARNING_LEVEL;
    return warning;
  }));

  // Get error line number for each error and assign it to the error object
  Promise.all(errorsAndWarnings.map(getLineNumber))
  .then(function (lineNumbers) {
    $scope.errors = errorsAndWarnings.map(function (error, index) {
      error.lineNumber = lineNumbers[index];
      error.type = getType(error);
      error.description = getDescription(error);
      return error;
    });
  });

  /**
   * Gets type description of an error object
   * @param {object} error
   * @returns {string}
  */
  function getType(error) {
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
  }

  /**
   * Gets description of an error object
   * @param {object} error
   * @returns {string}
  */
  function getDescription(error) {

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
  }

  /*
   * Determines if all errors are in warning level
   * @param {object} error
   * @returns {boolean}
   *
  */
  $scope.isOnlyWarnings = function (errors) {
    return !errors.some(function (error) {
      return error.level > WARNING_LEVEL;
    });
  };

  /**
   * Gets title of error modal
   *
   * @returns {string}
  */
  $scope.getTitle = function getTitle(errors) {
    var warnings = errors.filter(function (error) {
      return error.level < ERROR_LEVEL;
    });

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

  /**
   * Gets the line number for an error object
   *
   * @param {object} error
   * @returns {nubmer|Promise<number>}
  */
  function getLineNumber(error) {
    if (error.yamlError) {
      return error.yamlError.mark.line;
    }
    if (error.path && error.path.length) {
      return ASTManager.positionRangeForPath($rootScope.editorValue, error.path)
        .then(function (range) {
          return range.start.line;
        });
    }
  }

  /**
   * Focuses Ace editor to the line number of error
   * @param {object} error
   *
  */
  $scope.goToLineOfError = function (error) {
    if (error) {
      Editor.gotoLine(error.lineNumber);
      Editor.focus();
    }
  };

  /*
   * Determines if an error is in warning level
   *
   * @param {object} error
   * @returns {boolean}
  */
  $scope.isWarning = function (error) {
    return error.level < ERROR_LEVEL;
  };

  /*
   * Toggle the collapsed state of the modal
   *
  */
  $scope.toggleCollapse = function () {
    $scope.isCollapsed = !$scope.isCollapsed;
  };
});
