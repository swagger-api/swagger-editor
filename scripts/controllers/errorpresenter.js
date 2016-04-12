'use strict';

var _ = require('lodash');

SwaggerEditor.controller('ErrorPresenterCtrl', function ErrorPresenterCtrl(
  $scope, $rootScope, Editor, ASTManager) {
  var ERROR_LEVEL = 900;
  var WARNING_LEVEL = 500;

  $scope.isCollapsed = false;

  $scope.getErrorsAndWarnings = getErrorsAndWarnings;

  $scope.errorsAndWarnings = [];

  $rootScope.$watch('errors', assignErrorsAndWarnings);
  $rootScope.$watch('warnings', assignErrorsAndWarnings);

  assignErrorsAndWarnings();

  /**
   * Assigns errorsAndWarnings to scope
  */
  function assignErrorsAndWarnings() {
    getErrorsAndWarnings().then(function(errorsAndWarnings) {
      $scope.$apply(function() {
        $scope.errorsAndWarnings = errorsAndWarnings;
      });
    });
  }

  /**
   * Concatenate and modifies errors and warnings array to make it suitable for
   * Error Presenter
   * @return {Promsise<array>} presents error
  */
  function getErrorsAndWarnings() {
    var errorsAndWarnings = $rootScope.errors.map(function(error) {
      error.level = ERROR_LEVEL;
      return error;
    })

    .concat($rootScope.warnings.map(function(warning) {
      warning.level = WARNING_LEVEL;
      return warning;
    }))

    .map(function(error) {
      error.type = getType(error);
      error.description = getDescription(error);
      return error;
    });

    // Get error line number for each error and assign it to the error object
    return Promise.all(errorsAndWarnings.map(assignLineNumber));
  }

  /**
   * Gets type description of an error object
   * @param {object} error - error
   * @return {string} error's message
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
   * @param {object} error - error
   * @return {string} description of the error
  */
  function getDescription(error) {
    if (_.isString(error.description)) {
      return error.description;
    }

    if (_.isString(error.message)) {
      if (_.isString(error.description)) {
        return error.message + '<br>' + error.description;
      }
      return error.message;
    }

    if (error.emptyDocsError) {
      return error.emptyDocsError;
    }

    if (error.yamlError) {
      return error.yamlError.message.replace('JS-YAML: ', '').replace(/./,
        function(a) {
          return a.toUpperCase();
        });
    }

    if (error.resolveError) {
      return error.resolveError;
    }

    return error;
  }

  /**
   * Determines if all errors are in warning level
   * @param {object} errors - error
   * @return {boolean} true if not a warning
   *
  */
  $scope.isOnlyWarnings = function(errors) {
    return !errors.some(function(error) {
      return !error || error.level > WARNING_LEVEL;
    });
  };

  /**
   * Gets the line number for an error object
   *
   * @param {object} error - error
   * @return {nubmer|Promise<number>} line number
  */
  function assignLineNumber(error) {
    if (error.yamlError) {
      return new Promise(function(resolve) {
        error.lineNumber = error.yamlError.mark.line;
        resolve(error);
      });
    }

    if (_.isArray(error.path)) {
      var value = $rootScope.editorValue;
      var path = _.clone(error.path);

      return ASTManager.positionRangeForPath(value, path)
        .then(function(range) {
          error.lineNumber = range.start.line;
          return error;
        });
    }

    return error;
  }

  /**
   * Focuses Ace editor to the line number of error
   * @param {object} error - error
   *
  */
  $scope.goToLineOfError = function(error) {
    if (error) {
      Editor.gotoLine(error.lineNumber);
      Editor.focus();
    }
  };

  /**
   * Determines if an error is in warning level
   *
   * @param {object} error - error
   * @return {boolean} true if it is a warning
  */
  $scope.isWarning = function(error) {
    return error && error.level < ERROR_LEVEL;
  };

  /**
   * Toggle the collapsed state of the modal
   *
  */
  $scope.toggleCollapse = function() {
    $scope.isCollapsed = !$scope.isCollapsed;
  };
});
