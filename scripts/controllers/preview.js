'use strict';

var _ = require('lodash');
var SparkMD5 = require('spark-md5');
var angular = require('angular');

SwaggerEditor.controller('PreviewCtrl', function PreviewCtrl(Storage, Builder,
  ASTManager, Editor, FocusedPath, TagManager, Preferences, FoldStateManager,
  $scope, $rootScope, $stateParams, $sessionStorage) {
  $scope.loadLatest = loadLatest;
  $scope.tagIndexFor = TagManager.tagIndexFor;
  $scope.getAllTags = TagManager.getAllTags;
  $scope.tagsHaveDescription = TagManager.tagsHaveDescription;
  $scope.getCurrentTags = TagManager.getCurrentTags;
  $scope.stateParams = $stateParams;
  $scope.isVendorExtension = isVendorExtension;
  $scope.showOperation = showOperation;
  $scope.showDefinitions = showDefinitions;
  $scope.responseCodeClassFor = responseCodeClassFor;
  $scope.focusEdit = focusEdit;
  $scope.showPath = showPath;
  $scope.foldEditor = FoldStateManager.foldEditor;
  $scope.listAllOperation = listAllOperation;
  $scope.listAllDefnitions = listAllDefnitions;

  Storage.addChangeListener('yaml', update);
  Preferences.onChange(function() {
    update($rootScope.editorValue);
  });

  /**
   * Reacts to updates of YAML in storage that usually triggered by editor
   * changes.
   * @param {object} latest - the swagger spec.
   * @param {boolean} force - updates the force.
   * @return {undefined}
  */
  function update(latest, force) {
    if (!Preferences.get('liveRender') && !force && $scope.specs) {
      $rootScope.isDirty = true;
      $rootScope.progressStatus = 'progress-unsaved';
      return;
    }

    // Error can come in success callback, because of recursive promises
    // So we install same handler for error and success
    Builder.buildDocs(latest).then(onBuildSuccess, onBuildFailure);
  }

  /**
   * General callback for builder results
   * @param {Object} result - the result object
  */
  function onBuild(result) {
    $scope.$broadcast('toggleWatchers', true);  // turn watchers back on

    if (result.specs && result.specs.securityDefinitions) {
      var securityKeys = {};
      _.forEach(result.specs.securityDefinitions, function(security, key) {
        securityKeys[key] =
          SparkMD5.hash(JSON.stringify(security));
      });
      $sessionStorage.securityKeys = securityKeys;
    }

    $rootScope.$apply(function() {
      if (result.specs) {
        TagManager.registerTagsFromSpec(result.specs);

        // Retrive and put back fold state
        _.defaultsDeep(result.specs,
          FoldStateManager.getFoldedTree($rootScope.specs, result.specs));

        $rootScope.specs = result.specs;
      }
      $rootScope.errors = result.errors || [];
      $rootScope.warnings = result.warnings || [];
    });
  }

  /**
   * Callback of builder success
   * @param {Object} result - the result object
  */
  function onBuildSuccess(result) {
    onBuild(result);

    $rootScope.$apply(function() {
      $rootScope.progressStatus = 'success-process';
    });

    Editor.clearAnnotation();

    _.each(result.warnings, function(warning) {
      Editor.annotateSwaggerError(warning, 'warning');
    });
  }

  /**
   * Callback of builder failure
   * @param {Object} result - the result object
  */
  function onBuildFailure(result) {
    onBuild(result);

    $rootScope.$apply(function() {
      if (angular.isArray(result.errors)) {
        if (result.errors[0].yamlError) {
          Editor.annotateYAMLErrors(result.errors[0].yamlError);
          $rootScope.progressStatus = 'error-yaml';
        } else if (result.errors.length) {
          $rootScope.progressStatus = 'error-swagger';
          result.errors.forEach(function(error) {
            Editor.annotateSwaggerError(error, 'error');
          });
        } else {
          $rootScope.progressStatus = 'progress';
        }
      } else {
        $rootScope.progressStatus = 'error-general';
      }
    });
  }

  /**
   * Loads the latest spec from editor value
  */
  function loadLatest() {
    update($rootScope.editorValue, true);
    $rootScope.isDirty = false;
  }

  /**
   * Focuses editor to a line that represents that path beginning
   * @param {AngularEvent} $event - angular event
   * @param {array} path - an array of keys into specs structure
  */
  function focusEdit($event, path) {
    $event.stopPropagation();

    ASTManager.positionRangeForPath($rootScope.editorValue, path)
    .then(function(range) {
      Editor.gotoLine(range.start.line);
      Editor.focus();
    });
  }

  /**
   * Response CSS class for an HTTP response code
   *
   * @param {number} code - The HTTP Response CODE
   *
   * @return {string} - CSS class to be applied to the response code HTML tag
  */
  function responseCodeClassFor(code) {
    var colors = {
      2: 'green',
      3: 'blue',
      4: 'yellow',
      5: 'red'
    };
    return colors[Math.floor(Number(code) / 100)] || 'default';
  }

  /**
   * Determines if a key is a vendor extension key
   * Vendor extensions always start with `x-`
   *
   * @param {string} key - key
   *
   * @return {boolean} ture if key is a vendor extension
  */
  function isVendorExtension(key) {
    return _.startsWith(key, 'x-');
  }

  /**
   * Determines if we should render the definitions sections
   *
   * @param {object|null} definitions - the definitions object of Swagger spec
   *
   * @return {boolean} - true if definitions object should be rendered, false
   *  otherwise
  */
  function showDefinitions(definitions) {
    return angular.isObject(definitions);
  }

  /**
   * Determines if an operation should be shown or not
   * @param  {object} operation     the operation object
   * @param  {string} operationName the operation name in path hash
   * @return {boolean}              true if the operation should be shown
   */
  function showOperation(operation, operationName) {
    var currentTagsLength = TagManager.getCurrentTags() &&
      TagManager.getCurrentTags().length;

    if (isVendorExtension(operationName)) {
      return false;
    }

    if (operationName === 'parameters') {
      return false;
    }

    if (!currentTagsLength) {
      return true;
    }

    return operation.tags && operation.tags.length &&
      _.intersection(TagManager.getCurrentTags(), operation.tags).length;
  }

  /**
   * Determines if apath should be shown or not
   * @param  {object} path     the path object
   * @param  {string} pathName the path name in paths hash
   * @return {boolean}         true if the path should be shown
   */
  function showPath(path, pathName) {
    if (isVendorExtension(pathName)) {
      return false;
    }

    return _.some(path, showOperation);
  }

  /**
   * Folds all operation regardless of their current fold status
   *
  */
  function listAllOperation() {
    // unfold folded paths first
    _.each($scope.specs.paths, function(path, pathName) {
      if (_.isObject(path) && path.$folded === true) {
        path.$folded = false;
        FoldStateManager.foldEditor(['paths', pathName], false);
      }
    });

    _.each($scope.specs.paths, function(path, pathName) {
      _.each(path, function(operation, operationName) {
        if (_.isObject(operation)) {
          operation.$folded = true;
          FoldStateManager.foldEditor([
            'paths',
            pathName,
            operationName
          ], true);
        }
      });
    });
  }

  /**
   * Folds all definitions regardless of their current fold status
   *
  */
  function listAllDefnitions() {
    _.each($scope.specs.definitions, function(definition, definitionName) {
      if (_.isObject(definition)) {
        definition.$folded = true;
        FoldStateManager.foldEditor(['definitions', definitionName], true);
      }
    });
  }
});
