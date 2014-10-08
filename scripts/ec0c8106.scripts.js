// Use single curly brace for templates (used in spec)
_.templateSettings = {
  interpolate: /\{(.+?)\}/g
};

'use strict';

window.PhonicsApp = angular.module('PhonicsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.ace',
  'ui.bootstrap',
  'ngStorage',
  'ngSanitize',
  'jsonFormatter',
  'hc.marked',
  'ui.layout',
  'mohsen1.json-schema-view'
]);

'use strict';

PhonicsApp.config(function Router($compileProvider, $stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('home', {
    url: '/{mode}?import',
    views: {
      '': {
        templateUrl: function ($statePrams) {
          if ($statePrams.mode === 'edit') {
            return 'views/main.html';
          } else {
            return 'views/main-preview.html';
          }
        },
        controller: 'MainCtrl'
      },
      'header@home': {
        templateUrl: 'views/header/header.html',
        controller: 'HeaderCtrl'
      },
      'editor@home': {
        templateUrl: 'views/editor/editor.html',
        controller: 'EditorCtrl'
      },
      'preview@home': {
        templateUrl: 'views/preview/preview.html',
        controller: 'PreviewCtrl'
      }
    }
  });

  $compileProvider.aHrefSanitizationWhitelist('.');
});

'use strict';

PhonicsApp.controller('MainCtrl', function MainCtrl($rootScope, $stateParams,
  $location, Editor, Storage, FileLoader, BackendHealthCheck, defaults) {
  $rootScope.$on('$stateChangeStart', Editor.initializeEditor);
  BackendHealthCheck.startChecking();
  $rootScope.$on('$stateChangeStart', loadYaml);
  $rootScope.isPreviewMode = $stateParams.mode !== 'edit';

  // TODO: find a better way to add the branding class (grunt html template)
  $('body').addClass(defaults.brandingCssClass);

  loadYaml();
  /*
  * Load Default or URL YAML
  */
  function loadYaml() {
    Storage.load('yaml').then(function (yaml) {
      var url;

      // If there is a url provided, override the storage with that URL
      if ($stateParams.import) {
        url = $stateParams.import;
        $location.search('import', null);

      // If there is no saved YAML either, load the default example
      } else if (!yaml) {
        url = defaults.examplesFolder + defaults.exampleFiles[0];
      }

      if (url) {
        FileLoader.loadFromUrl(url).then(function (yaml) {
          if (yaml) {
            Storage.save('yaml', yaml);
            Editor.setValue(yaml);
          }
        });
      }
    });
  }
});

'use strict';

PhonicsApp.controller('HeaderCtrl', function HeaderCtrl($scope, Editor, Storage, Builder, Codegen, $modal, $stateParams, defaults, strings) {

  if ($stateParams.path) {
    $scope.breadcrumbs  = [{ active: true, name: $stateParams.path }];
  } else {
    $scope.breadcrumbs  = [];
  }

  // var statusTimeout;
  Storage.addChangeListener('progress', function (progressStatus) {
    $scope.status = strings.stausMessages[progressStatus];
    $scope.statusClass = null;

    if (progressStatus > 0) {
      $scope.statusClass = 'success';
    }

    if (progressStatus < 0) {
      $scope.statusClass = 'error';
    }
  });

  // Show the intro if it's first time visit
  Storage.load('intro').then(function (intro) {
    if (!intro && !defaults.disableNewUserIntro) {
      $scope.showAbout = true;
      Storage.save('intro', true);
    }
  });

  // -- Client and Server menus
  $scope.disableCodeGen = defaults.disableCodeGen;

  Codegen.getServers().then(function (servers) {
    $scope.servers = servers;
  });

  Codegen.getClients().then(function (clinets) {
    $scope.clinets = clinets;
  });

  $scope.getServer = function (language) {
    Codegen.getServer(language).then(noop, showCodegenError);
  };

  $scope.getClient = function (language) {
    Codegen.getClient(language).then(noop, showCodegenError);
  };

  function showCodegenError(resp) {
    $modal.open({
      templateUrl: 'templates/code-gen-error-modal.html',
      controller: 'GeneralModal',
      size: 'large',
      resolve: {
        data:  function () { return resp.data; }
      }
    });
  }

  $scope.showFileMenu = function () {
    return !defaults.disableFileMenu;
  };

  $scope.showHeaderBranding = function () {
    return defaults.headerBranding;
  };

  $scope.newProject = function () {
    Editor.setValue('');
    Storage.reset();
  };

  $scope.assignDownloadHrefs = function () {
    assignDownloadHrefs($scope, Storage);
  };

  $scope.openImportFile = function () {
    $modal.open({
      templateUrl: 'templates/file-import.html',
      controller: 'FileImportCtrl',
      size: 'large'
    });
  };

  $scope.openImportUrl = function () {
    $modal.open({
      templateUrl: 'templates/url-import.html',
      controller: 'UrlImportCtrl',
      size: 'large'
    });
  };

  $scope.toggleAboutEditor = function (value) {
    $scope.showAbout = value;
  };

  $scope.openExamples = function () {
    $modal.open({
      templateUrl: 'templates/open-examples.html',
      controller: 'OpenExamplesCtrl',
      size: 'large'
    });
  };

  function assignDownloadHrefs() {
    var MIME_TYPE = 'text/plain';

    Storage.load('yaml').then(function (yaml) {

      // JSON
      var json = jsyaml.load(yaml);

      // swagger and version should be a string to comfort with the schema
      if (json.info.version) {
        json.info.version = String(json.info.version);
      }
      if (json.swagger) {
        if (json.swagger === 2) {
          json.swagger = '2.0';
        } else {
          json.swagger = String(json.swagger);
        }
      }

      json = JSON.stringify(json, null, 4);
      var jsonBlob = new Blob([json], {type: MIME_TYPE});
      $scope.jsonDownloadHref = window.URL.createObjectURL(jsonBlob);
      $scope.jsonDownloadUrl = [MIME_TYPE, 'swagger.json', $scope.jsonDownloadHref].join(':');

      // YAML
      var yamlBlob = new Blob([yaml], {type: MIME_TYPE});
      $scope.yamlDownloadHref = window.URL.createObjectURL(yamlBlob);
      $scope.yamlDownloadUrl = [MIME_TYPE, 'swagger.yaml', $scope.yamlDownloadHref].join(':');
    });
  }

  function noop() {

  }
});

'use strict';

PhonicsApp.directive('onReadFile', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    scope: false,
    link: function (scope, element, attrs) {
      var fn = $parse(attrs.onReadFile);

      element.on('change', function (onChangeEvent) {
        var reader = new FileReader();

        reader.onload = function (onLoadEvent) {
          scope.$apply(function () {
            fn(scope, {$fileContent: onLoadEvent.target.result});
          });
        };

        reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
      });
    }
  };
}]);

'use strict';

PhonicsApp.directive('path', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/path.html',
    scope: false
  };
});

'use strict';

PhonicsApp.directive('operation', [function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/operation.html',
    scope: false
  };
}]);

'use strict';

PhonicsApp.directive('dropdownMenu', function () {
  return {
    templateUrl: 'templates/dropdown-menu.html',
    restrict: 'E',
    transclude: true,
    scope: {
      label: '@',
      onOpen: '='
    }
  };
});

'use strict';

/*
** Removes vendor extensions (x- keys) deeply from an object
*/
function removeVendorExtensions(obj) {
  if (!angular.isObject(obj)) {
    return obj;
  }

  var result = {};

  Object.keys(obj).forEach(function (k) {
    if (k.toLowerCase().substring(0, 2) !== 'x-') {
      result[k] = removeVendorExtensions(obj[k]);
    }
  });

  return result;
}

PhonicsApp
  .directive('schemaModel', function ($parse) {
    return {
      templateUrl: 'templates/schema-model.html',
      restrict: 'E',
      replace: true,
      scope: {
        schema: '='
      },
      link: function postLink($scope, $element, $attributes) {
        $scope.mode = 'model';
        $scope.json = removeVendorExtensions($parse($attributes.schema)($scope.$parent));
      }
    };
  });

'use strict';

PhonicsApp.filter('getResourceName', function () {
  return function getResourceNameFilter(resource) {
    return resource.resourcePath.replace(/\//g, '');
  };
});

'use strict';

(function (i,s,o,g,r,a,m) {i['GoogleAnalyticsObject']=r;i[r]=i[r]||function () {
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

// Load the plugin.
ga('require', 'linker');

// Define which domains to autoLink.
ga('linker:autoLink', [
  'wordnik.github.io',
  'apigee.github.io',
  'swagger.wordnik.com',
  'editor.swagger.wordnik.com'
  ]);

ga(
  'create',
  'UA-51231036-1',
  'auto', {
    'allowLinker': true
  }
  );

ga('send', 'pageview');

'use strict';

PhonicsApp.directive('tryOperation', function () {
  return {
    templateUrl: 'templates/try-operation.html',
    restrict: 'E',
    replace: true,
    scope: {
      operation: '='
    },
    link: function postLink(scope) {
      // FIXME: fix this insanity!
      var specs = scope.$parent.$parent.$parent.$parent.specs;

      scope.httpProtorcol = 'HTTP/1.1';
      scope.paramModels = {};
      scope.hasParams = Array.isArray(scope.$parent.operation.parameters);
      scope.hasBody = scope.hasParams && scope.$parent.operation.parameters.some(function (parameter) {
        return parameter.in === 'body';
      });
      scope.generateUrl = generateUrl;
      scope.makeCall = makeCall;
      scope.getContentTypeHeaders = getContentTypeHeaders;
      scope.xhrInProgress = false;
      scope.getHeaderParams = getHeaderParams;

      function getHeaderParams() {
        var headerParams = {};
        if (scope.hasParams) {
          scope.$parent.operation.parameters.filter(function (parameter) {
            if (parameter.in === 'header' && scope.paramModels[parameter.name]) {
              headerParams[parameter.name] = scope.paramModels[parameter.name];
            }
          });
        }
        return headerParams;
      }

      function getContentTypeHeaders() {
        if (scope.$parent.operation.consumes) {
          return scope.$parent.operation.consumes;
        } else {
          return specs.consumes;
        }
      }

      function generateUrl() {
        var protocol = window.location.protocol;
        var host = specs.host || window.location.host;
        var basePath = specs.basePath || '';
        var path = scope.$parent.$parent.pathName;
        var pathTemplate = _.template(path);
        var params = scope.hasParams ? scope.$parent.operation.parameters : [];
        var pathParams = params.reduce(function (pathParams, parameter) {
          if (parameter.in === 'path') {
            pathParams[parameter.name] = scope.paramModels[parameter.name];
          }
          return pathParams;
        }, {});
        var queryParams =  params.reduce(function (queryParams, parameter) {
          if (parameter.in === 'query' && scope.paramModels[parameter.name]) {
            queryParams[parameter.name] = scope.paramModels[parameter.name];
          }
          return queryParams;
        }, {});
        var queryParamsStr = $.param(queryParams);

        return protocol + '//' + host + basePath + pathTemplate(pathParams) +
          (queryParamsStr ? '?' + queryParamsStr : '');
      }

      function makeCall() {
        scope.response = null;
        scope.xhrInProgress = true;
        scope.failed = false;

        $.ajax({
          url: scope.generateUrl(),
          type: scope.$parent.operationName,
          headers: _.extend({
            'Content-Type': scope.contentType
          }, getHeaderParams())
        })

        .fail(function () {
          scope.failed = true;
        })

        .always(function (resp) {
          if (!resp) {
            scope.responseText = '';
            scope.xhrInProgress = false;
            scope.$digest();
            return;
          }

          var text;
          try {
            text = JSON.stringify(
              JSON.parse(resp.responseText),
            null, 2);
          } catch (e) {
            text = resp.responseText;
          }
          if (angular.isString(text) && text.indexOf('<?xml') === 0) {
            scope.responseText = $('<div/>').text(text).html();
          } else {
            scope.responseText = text;
          }

          scope.response = resp;
          scope.xhrInProgress = false;
          scope.$digest();
        });
      }
    }
  };
});

'use strict';

/*
** Because Angular will sort hash keys alphabetically we need
** translate hashes to arrays in order to keep the order of the
** elements.
** Order information is coming from FoldManager via x-row properties
*/
PhonicsApp.service('Sorter', function Sorter() {

  // The standard order property name
  var XDASH = 'x-';
  var XROW = 'x-row';

  /*
  ** Sort specs hash (paths, operations and responses)
  */
  this.sort = function (specs) {
    if (specs && specs.paths) {
      var paths = Object.keys(specs.paths).map(function (pathName) {
        if (pathName.toLowerCase().substring(0, 2) === XDASH) {
          return;
        }
        var path = {
          pathName: pathName,
          operations: sortOperations(specs.paths[pathName])
        };
        path[XROW] = specs.paths[pathName][XROW];

        return path;
      }).sort(function (p1, p2) {
        return p1[XROW] - p2[XROW];
      });

      // Remove array holes
      specs.paths = _.compact(paths);
    }

    return specs;
  };

  /*
  ** Sort operations
  */
  function sortOperations(operations) {
    var arr = [];

    if (!angular.isObject(operations)) {
      return arr;
    }

    arr = Object.keys(operations).map(function (operationName) {
      if (operationName.toLowerCase().substring(0, 2) === XDASH) {
        return;
      }

      var operation = {
        operationName: operationName,
        responses: sortResponses(operations[operationName].responses)
      };

      // Remove responses object
      operations[operationName] = _.omit(operations[operationName], 'responses');

      // Add other properties
      _.extend(operation, operations[operationName]);

      return operation;
    }).sort(function (o1, o2) {
      return o1[XROW] - o2[XROW];
    });

    // Remove array holes
    return _.compact(arr);
  }

  function sortResponses(responses) {
    var arr = [];

    if (!angular.isObject(responses)) {
      return arr;
    }

    arr = Object.keys(responses).map(function (responseName) {
      if (responseName.toLowerCase().substring(0, 2) === XDASH) {
        return;
      }

      var response = _.extend({ responseCode: responseName },
        responses[responseName]);

      return response;
    }).sort(function (r1, r2) {
      return r1[XROW] - r2[XROW];
    });

    // Remove array holes
    return _.compact(arr);
  }
});

'use strict';

PhonicsApp.service('Operation', function Operation() {

  /*
  ** get a subpath for edit
  */
  this.getEditPath = function (pathName) {
    return '#/paths?path=' + window.encodeURIComponent(pathName);
  };

  /*
  ** Response CSS class for an HTTP response code
  */
  this.responseCodeClassFor = function (code) {
    var result = 'default';
    switch (Math.floor(+code / 100)) {
      case 2:
        result = 'green';
        break;
      case 5:
        result = 'red';
        break;
      case 4:
        result = 'yellow';
        break;
      case 3:
        result = 'blue';
    }
    return result;
  };

  /*
  ** Determines if a key is a vendor extension key
  ** Vendor extensions always start with `x-`
  */
  this.isVendorExtension = function (key) {
    return key.substring(0, 2).toLowerCase() === 'x-';
  };

});

'use strict';

/*
** takes a JSON or YAML string, returns YAML string
*/
function load(string) {
  var jsonError, yamlError;

  if (!angular.isString(string)) {
    throw new Error('load function only accepts a string');
  }

  // Try figuring out if it's a JSON string
  try {
    JSON.parse(string);
  } catch (error) {
    jsonError = error;
  }

  // if it's a JSON string, convert it to YAML string and return it
  if (!jsonError) {
    return jsyaml.dump(JSON.parse(string));
  }

  // Try parsing the string as a YAML string  and capture the error
  try {
    jsyaml.load(string);
  } catch (error) {
    yamlError = error;
  }

  // If there was no error in parsing the string as a YAML string
  // return the original string
  if (!yamlError) {
    return string;
  }

  // If it was neither JSON or YAML, throw an error
  throw new Error('load function called with an invalid string');
}

PhonicsApp.service('FileLoader', function FileLoader($http) {

  // Load from URL
  this.loadFromUrl = function (url) {
    return $http.get(url).then(function (resp) {
      return load(resp.data);
    });
  };

  // Load from Local file content (string)
  this.load = load;
});

'use strict';

PhonicsApp.controller('FileImportCtrl', function FileImportCtrl($scope, $modalInstance, FileLoader, $localStorage, Storage, Editor, FoldManager) {
  var results;

  $scope.fileChanged = function ($fileContent) {
    results = FileLoader.load($fileContent);
  };

  $scope.ok = function () {
    if (angular.isString(results)) {
      Editor.setValue(results);
      Storage.save('yaml', results);
      FoldManager.reset();
    }
    $modalInstance.close();
  };

  $scope.isInvalidFile = function () {
    return results === null;
  };

  $scope.isFileSelected = function () {
    return !!results;
  };

  $scope.cancel = $modalInstance.close;
});

'use strict';

PhonicsApp.service('Editor', function Editor() {
  var editor = null;
  var onReadyFns = [];
  var changeFoldFns = [];
  var that = this;

  function annotateYAMLErrors(error) {
    if (error && error.mark && error.reason) {
      editor.getSession().setAnnotations([{
        row: error.mark.line,
        column: error.mark.column,
        text: error.reason,
        type: 'error'
      }]);
    }
  }

  function clearAnnotation() {
    editor.getSession().clearAnnotations();
  }

  function aceLoaded(e) {

    // Assign class variable `editor`
    window.e = editor = e;

    // Set editor options
    editor.setOptions({
      fontFamily: 'Source Code Pro'
    });

    // Editor is ready, fire the on-ready function and flush the queue
    onReadyFns.forEach(function (fn) {
      fn(that);
    });
    onReadyFns = [];

    var session = editor.getSession();

    // Hookup changeFold listeners
    session.on('changeFold', onChangeFold);

    configureSession(session);
  }

  function onChangeFold() {
    var args = arguments;
    changeFoldFns.forEach(function (fn) {
      fn.apply(editor, args);
    });
  }

  function configureSession(session) {
    session.setTabSize(2);
  }

  function setValue(value) {
    if (angular.isString(value)) {
      editor.getSession().setValue(value);
    }

    // If it's an object, convert it YAML
    if (angular.isObject(value)) {
      setValue(jsyaml.dump(angular.copy(value)));
    }
  }

  function getValue() {
    return editor.getSession().getValue();
  }

  function resize() {
    editor.resize();
  }

  function ready(fn) {
    if (angular.isFunction(fn)) {
      onReadyFns.push(fn);
    }
  }

  function getAllFolds() {
    var session = editor.getSession();
    var folds = null;

    session.foldAll();
    folds = session.unfold();

    return Array.isArray(folds) ? folds : [];
  }

  function getLine(l) {
    return editor.session.getLine(l);
  }

  function onFoldChanged(fn) {
    changeFoldFns.push(fn);
  }

  function addFold(start, end) {
    editor.getSession().foldAll(start, end);
  }

  function removeFold(start) {
    // TODO: Depth of unfolding is hard-coded to 100 but we need
    // to have depth as a parameter and/or having smarter way of
    // handling subfolds
    editor.getSession().unfold(start, 100);
  }

  function gotoLine(line) {
    editor.gotoLine(line + 1);
  }

  this.getValue = getValue;
  this.setValue = setValue;
  this.aceLoaded = aceLoaded;
  this.resize = resize;
  this.ready = ready;
  this.annotateYAMLErrors = annotateYAMLErrors;
  this.clearAnnotation = clearAnnotation;
  this.getAllFolds = getAllFolds;
  this.getLine = getLine;
  this.onFoldChanged = onFoldChanged;
  this.addFold = addFold;
  this.removeFold = removeFold;
  this.gotoLine = gotoLine;
});

'use strict';

PhonicsApp.service('Builder', function Builder(Resolver, Validator, $q) {
  var load = _.memoize(jsyaml.load);

  /**
   * Build spec docs from a string value
   * @param {string} stringValue - the string to make the docs from
   * @returns {object} - Returns a promise that resolves to spec document object
   *  or get rejected because of HTTP failures of external $refs
  */
  function buildDocs(stringValue) {
    var json;
    var deferred = $q.defer();

    // If stringVlue is empty, return emptyDocsError
    if (!stringValue) {
      deferred.reject({
        specs: null,
        error: {emptyDocsError: {message: 'Empty Document'}}
      });

      return deferred.promise;
    }

    // if jsyaml is unable to load the string value return yamlError
    try {
      json = load(stringValue);
    } catch (yamlError) {
      deferred.reject({
        error: { yamlError: yamlError },
        specs: null
      });

      return deferred.promise;
    }

    // If stringValue is valid build it
    return buildDocsWithObject(json);
  }

  function buildDocsWithObject(json) {

    return Resolver.resolve(json)
      .then(function onSuccess(resolved) {
        var result = { specs: resolved };
        var error = Validator.validateSwagger(resolved);

        if (error && error.swaggerError) {
          result.error = error;
        }

        return result;
      }, function onFalure(resolveError) {
        return {
          error: {
            resolveError: resolveError.data,
            raw: resolveError
          },
          specs: null
        };
      });
  }

  /**
   * Gets a path JSON object and Specs, finds the path in the
   * specs JSON and updates it
   * @param {array} - path an array of keys to reach to an object in JSON structure
   * @param {string} - pathName
   * @param {object} - specs
  */
  function updatePath(path, pathName, specs) {
    var json;
    var error = null;

    try {
      json = load(path);
    } catch (e) {
      error = { yamlError: e };
    }

    if (!error) {
      specs.paths[pathName] = json[pathName];
    }

    return {
      specs: specs,
      error: error
    };
  }

  /*
   * Returns one path that matches pathName
   * Returns error object if there is schema incomparability issues
  */
  function getPath(specs, path) {
    return _.pick(specs.paths, path);
  }

  this.buildDocs = buildDocs;
  this.buildDocsWithObject = buildDocsWithObject;
  this.updatePath = updatePath;
  this.getPath = getPath;
});

'use strict';

/*
  Keeps track of current document validation
*/
PhonicsApp.service('Validator', function Validator(defaultSchema, defaults, $http) {
  var buffer = Object.create(null);
  var latestSchema;

  function getLatestSchema() {
    if (defaults.schemaUrl) {
      $http.get(defaults.schemaUrl).then(function (resp) {
        latestSchema = resp.data;
      });
    }
  }

  this.setStatus = function (status, isValid) {
    buffer[status] = !!isValid;
  };

  this.isValid = function () {
    for (var key in buffer) {
      if (!buffer[key]) {
        return {valid: false, reason: key};
      }
    }
    return {valid: true};
  };

  this.reset = function () {
    buffer = Object.create(null);
  };

  this.validateYamlString = function validateYamlString(string) {
    try {
      jsyaml.load(string);
    } catch (yamlLoadError) {
      var errorMessage = yamlLoadError.message.replace('JS-YAML: ', '');
      return {
        yamlError: {
          message: errorMessage,
          row: yamlLoadError.mark.line,
          column: yamlLoadError.mark.column
        }
      };
    }
    return null;
  };

  this.validateSwagger = function validateSwagger(json, schema) {
    // Refresh Schema for the next time
    getLatestSchema();

    schema = schema || latestSchema || defaultSchema;
    var isValid = tv4.validate(json, schema);

    if (isValid) {
      return null;
    } else {
      return {
        swaggerError: tv4.error
      };
    }

    return tv4.error;
  };
});

'use strict';

/*
  Manage fold status of the paths and operations
*/
PhonicsApp.service('FoldManager', function FoldManager(Editor, FoldPointFinder) {
  var buffer = Object.create(null);
  var changeListeners = [];

  Editor.ready(renewBuffer);

  /*
  ** Update buffer with changes from editor
  */
  function refreshBuffer() {
    _.defaults(FoldPointFinder.findFolds(Editor.getValue()), buffer);
    emitChanges();
  }

  /*
  ** Flush buffer and put new value in the buffer
  */
  function renewBuffer(value) {
    value = value || Editor.getValue();
    if (angular.isString(value)) {
      buffer = FoldPointFinder.findFolds(value);
      emitChanges();
    }
  }

  /*
  ** Let event listeners know there was a change in fold status
  */
  function emitChanges() {
    changeListeners.forEach(function (fn) {
      fn();
    });
  }

  /*
  ** Walk the buffer tree for a given path
  */
  function walk(keys, current) {
    current = buffer;

    if (!Array.isArray(keys) || !keys.length) {
      throw new Error('Need path for fold in fold buffer');
    }

    while (keys.length) {
      if (!current || !current.subFolds) {
        return null;
      }
      current = current.subFolds[keys.shift()];
    }

    return current;
  }

  /*
  ** Beneath first search for the fold that has the same start
  */
  function scan(current, start) {
    var result = null;
    var node, fold;

    if (current.start === start) {
      return current;
    }

    if (angular.isObject(current.subFolds)) {
      for (var k in current.subFolds) {
        if (angular.isObject(current.subFolds)) {
          node = current.subFolds[k];
          fold = scan(node, start);
          if (fold) {
            result = fold;
          }
        }
      }
    }

    return result;
  }

  /*
  ** Scan the specs tree and extend objects with order value
  ** We use 'x-row' as an order indication so rendered will ignore it
  ** because it's a vendor extension
  */
  function extendSpecs(specs, path) {
    var fold = null;
    var key;

    if (!path) {
      path = [];
    } else {
      path = _.clone(path);
    }

    // Only apply order value to objects
    if (angular.isObject(specs)) {

      // For each object in this object
      for (key in specs) {

        // Ignore prototype keys
        if (specs.hasOwnProperty(key)) {

          // add key to path and try looking up the tree with this path
          // for the fold corresponding the same object
          fold = walk(path.concat(key));

          // If fold exists append it to the object and push the key to path
          if (fold) {
            specs[key]['x-row'] = fold.start;
          }

          // Recessively do this until the end of the tree
          specs[key] = extendSpecs(specs[key], path.concat(key));
        }
      }
    }

    // Return modified object
    return specs;
  }

  /*
  ** Listen to fold changes in editor and reflect it in buffer
  */
  Editor.onFoldChanged(function (change) {
    var row = change.data.start.row;
    var folded = change.action !== 'remove';
    var fold = scan(buffer, row);

    if (fold) {
      fold.folded = folded;
    }

    refreshBuffer();
    emitChanges();
  });

  /*
  ** Toggle a fold status and reflect it in the editor
  */
  this.toggleFold = function () {
    var keys = [].slice.call(arguments, 0);
    var fold = walk(keys);

    if (fold.folded) {
      Editor.removeFold(fold.start + 1);
      fold.folded = false;
    } else {
      Editor.addFold(fold.start, fold.end);
      fold.folded = true;
    }

    refreshBuffer();
  };

  /*
  ** Return status of a fold with given path parameters
  */
  this.isFolded = function () {
    var keys = [].slice.call(arguments, 0);
    var fold = walk(keys);

    return fold && fold.folded;
  };

  /*
  ** Fold status change listener installer
  */
  this.onFoldStatusChanged = function (fn) {
    changeListeners.push(fn);
  };

  // Expose the methods externally
  this.reset = renewBuffer;
  this.refresh = refreshBuffer;
  this.extendSpecs = extendSpecs;
});

'use strict';

PhonicsApp.service('FoldPointFinder', function FoldPointFinder() {
  var TAB_SIZE = 2;
  var tab = '  ';

  /*
  ** Find folds from YAML sting
  */
  this.findFolds = function findFolds(yamlString) {
    var lines = yamlString.split('\n');

    // Return up to 3 level
    return { subFolds: getFolds(lines, 2, 0) };
  };

  /*
  ** Get folds from and array of lines
  */
  function getFolds(lines, level, offset) {
    var folds = Object.create(null);
    var currentFold = null;
    var key, l, line;

    // Iterate in lines
    for (l = 0; l < lines.length; l++) {
      line = lines[l];

      // If line is not indented it can be an object key or a key: value pair
      if (line.substr(0, TAB_SIZE) !== tab) {
        key = line.trim();

        // Cover the case that key is quoted. Example: "/user/{userId}":
        if ((key[0] === '"') && (key[key.length - 2] === '"') && (key[key.length - 1] === ':')) {
          key = key.substring(1, key.length - 2) + ':';
        }

        // If colon is not the last character it's not an object key
        if (!key || key.lastIndexOf(':') !== key.length - 1) {
          continue;
        }

        // Omit colon character
        if (key[key.length - 1] === ':') {
          key = key.substring(0, key.length - 1);
        }

        // If there is no current fold in progress initiate one
        if (currentFold === null) {
          currentFold = {
            start: l + offset,
            folded: false,
            end: null
          };
          folds[key] = currentFold;

        // else, add middle folds recessively and close current fold in progress
        } else {
          addSubFoldsAndEnd(lines, l, currentFold, level, offset);

          currentFold = {
            start: l + offset,
            end: null
          };
          folds[key] = currentFold;
        }
      }
    }

    // In case there is a current fold in progress finish it
    addSubFoldsAndEnd(lines, l, currentFold, level, offset);

    return folds;
  }

  /*
  ** Adds subfolds and finish fold in progress
  */
  function addSubFoldsAndEnd(lines, l, currentFold, level, offset) {
    var foldLines, subFolds;

    // If there is a current fold, otherwise nothing to do
    if (currentFold !== null) {

      // set end property which is current line + offset
      currentFold.end = l - 1 + offset;

      // If it's not too deep
      if (level > 0) {

        // Get fold lines and remove the indent in
        foldLines = lines.slice(currentFold.start + 1 - offset, currentFold.end - offset).map(indent);

        // Get subFolds recursively
        subFolds = getFolds(foldLines, level - 1, currentFold.start + 1);

        // If results are not empty assign it
        if (!_.isEmpty(subFolds)) {
          currentFold.subFolds = subFolds;
        }
      }
    }
  }

  /*
  ** Removes indent of a line one tab
  */
  function indent(l) {
    return l.substring(TAB_SIZE);
  }
});

'use strict';

/*
  Resolves YAML $ref references
*/
PhonicsApp.service('Resolver', function Resolver($q, $http) {

  /*
  ** gets a JSON object and recursively resolve all $ref references
  ** root object is being passed to get the actual result of the
  ** $ref reference
  */
  function resolve(json, root) {

    // If it's first time resolve being called root would be the same object
    // as json
    if (!root) {
      root = json;
    }

    // If json is an array, iterate in the array and apply resolve to each element
    // of the array and return it
    if (Array.isArray(json)) {
      return $q.all(json.map(function (item) {
        return resolve(item, root);
      }));
    }

    // if json is not an object we can't resolve it. The json itself is resolved json
    if (!angular.isObject(json)) {
      var deferred = $q.defer();

      deferred.resolve(json);

      return deferred.promise;
    }

    // If there is a `$ref` key in the json object, ignore all other keys and
    // return resolved `$ref`
    if (json.$ref) {
      return lookup(json.$ref, root).then(function (result) {
        return resolve(result, root);
      });
    }

    // Initialize an array of promises of object keys
    var promises = [];

    // For each key in json check if the key is a resolve key ($ref)
    Object.keys(json).forEach(function (key) {
      promises.push(resolve(json[key], root));
    });

    // After getting all promises resolved, rebuild the object from results of
    // resolved promises and Object.keys of the json object. Order of the resolved
    // promises should be the same as Object.keys of the json object
    return $q.all(promises).then(function (resultsArr) {
      var resultObj = {};

      Object.keys(json).forEach(function (key, keyIndex) {
        resultObj[key] = resultsArr[keyIndex];
      });

      return resultObj;
    });

  }

  /**
  * With a given JSON-Schema address and an object (root) returns
  * the object that $ref address is pointing too
  * @param {string} address - The address to lookup
  * @root {object} root - the JSON Schema to lookup in
  * @returns {promise} - Resolves to result of the lookup or get rejected because of
  *   HTTP failures
  */
  function lookup(address, root) {
    var deferred = $q.defer();

    // If it's an http lookup, GET it and resolve to it's data
    if (/^http(s?):\/\//.test(address)) {
      return $http.get(address).then(function (resp) {
        return resp.data;
      });
    }

    // If address is a shorthand without #definition make the address a longhand address
    if (address.indexOf('#/') !== 0) {
      address = '#/definitions/' + address;
    }

    // Get array of keys to reach to the object
    var path = address.substring(2).split('/');
    var current = root;
    var key;

    // Recursively drill-into the object with array of keys until path is empty
    while (path.length) {
      key = path.shift();

      // If path was invalid and objects at this key is not valid, throw an error
      if (!current[key]) {
        deferred.reject({
          data: 'Can not lookup ' + key + ' in ' + angular.toJson(current)
        });
      }
      current = current[key];
    }
    deferred.resolve(current);

    return deferred.promise;
  }

  // Expose resolve externally
  this.resolve = resolve;
});

'use strict';

/*
 * Checks for backend health and set "progress" value accordingly
*/
PhonicsApp.service('BackendHealthCheck', function BackendHealthCheck($http, $interval, defaults, Storage) {
  var isHealthy = true;

  this.startChecking = function () {
    $interval(function () {
      $http.get(window.location.href).then(
        function onSuccess() {
          isHealthy = true;
        },
        function onError() {
          isHealthy = false;
          Storage.save('progress', -2);
        }
      );
    }, defaults.backendHelathCheckTimeout);
  };

  this.isHealthy = function () {
    return isHealthy;
  };
});

'use strict';

/*
 * Code Generator service
*/
PhonicsApp.service('Codegen', function Codegen($http, defaults, Storage) {
  this.getServers = function () {
    return $http.get(defaults.codegen.servers).then(function (resp) {
      return resp.data;
    });
  };

  this.getClients = function () {
    return $http.get(defaults.codegen.clients).then(function (resp) {
      return resp.data;
    });
  };

  this.getServer = function (language) {
    var url = _.template(defaults.codegen.server)({
      language: language
    });

    return Storage.load('yaml').then(function (yaml) {
      var specs = jsyaml.load(yaml);

      return $http.post(url, {swagger: specs}).then(redirect);
    });
  };

  this.getClient = function (language) {
    var url = _.template(defaults.codegen.client)({
      language: language
    });

    return Storage.load('yaml').then(function (yaml) {
      var specs = jsyaml.load(yaml);

      return $http.post(url, {swagger: specs}).then(redirect);
    });
  };

  function redirect(resp) {
    if (angular.isObject(resp) && resp.code) {
      window.location = resp.data.code;
    }
  }
});

'use strict';

PhonicsApp.controller('EditorCtrl', function EditorCtrl($scope, Editor, Builder, Storage, FoldManager) {
  var debouncedOnAceChange = _.debounce(onAceChange, 1000);
  $scope.aceLoaded = Editor.aceLoaded;
  $scope.aceChanged = function () {
    Storage.save('progress', 0);
    debouncedOnAceChange();
  };
  Editor.ready(function () {
    Storage.load('yaml').then(function (yaml) {
      Editor.setValue(yaml);
      FoldManager.reset(yaml);
      onAceChange();
    });
  });

  function onAceChange() {
    var value = Editor.getValue();

    Storage.save('yaml', value);
    FoldManager.refresh();
  }
});

'use strict';

PhonicsApp.controller('PreviewCtrl', function PreviewCtrl(Storage, Builder, FoldManager,
  Sorter, Editor, Operation, BackendHealthCheck, $scope, $rootScope) {
  function update(latest) {

    // If backend is not healthy don't update
    if (!BackendHealthCheck.isHealthy() && !$rootScope.isPreviewMode) {
      return;
    }

    // Error can come in success callback, because of recursive promises
    // So we install same handler for error and success
    Builder.buildDocs(latest).then(onResult, onResult);
  }

  function onResult(result) {
    var specs = FoldManager.extendSpecs(result.specs);
    $scope.specs = Sorter.sort(specs);
    $scope.error = null;
    Storage.save('progress',  1); // Saved

    if (!$rootScope.isPreviewMode) {
      Editor.clearAnnotation();
    }

    if (result.error) {
      if (result.error.yamlError && !$rootScope.isPreviewMode) {
        Editor.annotateYAMLErrors(result.error.yamlError);
      }
      $scope.error = result.error;
      Storage.save('progress', -1); // Error
    }
  }

  Storage.addChangeListener('yaml', update);

  // If app is in preview mode, load the yaml from storage
  if ($rootScope.isPreviewMode) {
    Storage.load('yaml').then(update);
  }

  FoldManager.onFoldStatusChanged(function () {
    _.defer(function () { $scope.$apply(); });
  });
  $scope.toggle = FoldManager.toggleFold;
  $scope.isCollapsed = FoldManager.isFolded;

  $scope.focusEdit = function ($event, line) {
    $event.stopPropagation();
    Editor.gotoLine(line);
  };

  // Add operation service methods directly
  _.extend($scope, Operation);
});

'use strict';

/*
 * Determines if LocalStorage should be used for storage or a Backend
*/
PhonicsApp.service('Storage', function Storage(LocalStorage, Backend, defaults) {
  if (defaults.useBackendForStorage) {
    return Backend;
  }

  return LocalStorage;
});

'use strict';

PhonicsApp.service('LocalStorage', function LocalStorage($localStorage, $q) {
  var storageKey = 'SwaggerEditorCache';
  var changeListeners =  Object.create(null);
  var that = this;

  $localStorage[storageKey] = $localStorage[storageKey] || Object.create(null);

  this.save = function (key, value) {
    if (value === null) {
      return;
    }

    if (Array.isArray(changeListeners[key])) {
      changeListeners[key].forEach(function (fn) {
        fn(value);
      });
    }

    _.debounce(function () {
      window.requestAnimationFrame(function () {
        $localStorage[storageKey][key] = value;
      });
    }, 100)();
  };

  this.reset = function () {
    Object.keys($localStorage[storageKey]).forEach(function (key) {
      that.save(key, '');
    });
  };

  this.load = function (key) {
    var deferred = $q.defer();
    if (!key) {
      deferred.resolve($localStorage[storageKey]);
    } else {
      deferred.resolve($localStorage[storageKey][key]);
    }

    return deferred.promise;
  };

  this.addChangeListener = function (key, fn) {
    if (angular.isFunction(fn)) {
      if (!changeListeners[key]) {
        changeListeners[key] = [];
      }
      changeListeners[key].push(fn);
    }
  };
});

PhonicsApp.config( ['$provide', function ($provide) {
  $provide.constant('defaultSchema',

// Scheme JSON:
{
  "title": "A JSON Schema for Swagger 2.0 API.",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "required": [
    "swagger",
    "info",
    "paths"
  ],
  "additionalProperties": false,
  "patternProperties": {
    "^x-": {
      "$ref": "#/definitions/vendorExtension"
    }
  },
  "properties": {
    "swagger": {
      "type": "number",
      "enum": [
        2
      ],
      "description": "The Swagger version of this document."
    },
    "info": {
      "$ref": "#/definitions/info"
    },
    "externalDocs": {
      "$ref": "#/definitions/externalDocs"
    },
    "host": {
      "type": "string",
      "format": "uri",
      "pattern": "^((?!\\://).)*$",
      "description": "The fully qualified URI to the host of the API."
    },
    "basePath": {
      "type": "string",
      "pattern": "^/",
      "description": "The base path to the API. Example: '/api'."
    },
    "schemes": {
      "type": "array",
      "description": "The transfer protocol of the API.",
      "items": {
        "type": "string",
        "enum": [
          "http",
          "https",
          "ws",
          "wss"
        ]
      }
    },
    "consumes": {
      "type": "array",
      "description": "A list of MIME types accepted by the API.",
      "items": {
        "$ref": "#/definitions/mimeType"
      }
    },
    "produces": {
      "type": "array",
      "description": "A list of MIME types the API can produce.",
      "items": {
        "$ref": "#/definitions/mimeType"
      }
    },
    "paths": {
      "type": "object",
      "description": "Relative paths to the individual endpoints. They must be relative to the 'basePath'.",
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        },
        "^/$|^/.*[^/]$": {
          "$ref": "#/definitions/pathItem"
        }
      },
      "additionalProperties": false
    },
    "definitions": {
      "type": "object",
      "description": "One or more JSON objects describing the schemas being consumed and produced by the API.",
      "additionalProperties": {
        "$ref": "#/definitions/schema"
      }
    },
    "parameters": {
      "type": "object",
      "description": "One or more JSON representations for parameters",
      "additionalProperties": {
        "$ref": "#/definitions/parameter"
      }
    },
    "responses": {
      "$ref": "#/definitions/responses"
    },
    "security": {
      "$ref": "#/definitions/security"
    },
    "tags": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/tag"
      }
    }
  },
  "definitions": {
    "externalDocs": {
      "type": "object",
      "description": "information about external documentation",
      "required": [
        "url"
      ],
      "properties": {
        "description": {
          "type": "string"
        },
        "url": {
          "type": "string",
          "format": "uri"
        }
      }
    },
    "info": {
      "type": "object",
      "description": "General information about the API.",
      "required": [
        "version",
        "title"
      ],
      "additionalProperties": false,
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      },
      "properties": {
        "version": {
          "type": "string",
          "description": "A semantic version number of the API."
        },
        "title": {
          "type": "string",
          "description": "A unique and precise title of the API."
        },
        "description": {
          "type": "string",
          "description": "A longer description of the API. Should be different from the title.  Github-flavored markdown is allowed."
        },
        "termsOfService": {
          "type": "string",
          "description": "The terms of service for the API."
        },
        "contact": {
          "type": "object",
          "description": "Contact information for the owners of the API.",
          "additionalProperties": false,
          "properties": {
            "name": {
              "type": "string",
              "description": "The identifying name of the contact person/organization."
            },
            "url": {
              "type": "string",
              "description": "The URL pointing to the contact information.",
              "format": "uri"
            },
            "email": {
              "type": "string",
              "description": "The email address of the contact person/organization.",
              "format": "email"
            }
          }
        },
        "license": {
          "type": "object",
          "required": [
            "name"
          ],
          "additionalProperties": false,
          "properties": {
            "name": {
              "type": "string",
              "description": "The name of the license type. It's encouraged to use an OSI compatible license."
            },
            "url": {
              "type": "string",
              "description": "The URL pointing to the license.",
              "format": "uri"
            }
          }
        }
      }
    },
    "example": {
      "type": "object",
      "patternProperties": {
        "^[a-z0-9-]+/[a-z0-9\\-+]+$": {}
      },
      "additionalProperties": false
    },
    "mimeType": {
      "type": "string",
      "pattern": "^[\\sa-z0-9\\-+;\\.=\\/]+$",
      "description": "The MIME type of the HTTP message."
    },
    "operation": {
      "type": "object",
      "required": [
        "responses"
      ],
      "additionalProperties": false,
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      },
      "properties": {
        "tags": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "summary": {
          "type": "string",
          "description": "A brief summary of the operation."
        },
        "description": {
          "type": "string",
          "description": "A longer description of the operation, github-flavored markdown is allowed."
        },
        "externalDocs": {
          "$ref": "#/definitions/externalDocs"
        },
        "operationId": {
          "type": "string",
          "description": "A friendly name of the operation"
        },
        "produces": {
          "type": "array",
          "description": "A list of MIME types the API can produce.",
          "additionalItems": false,
          "items": {
            "$ref": "#/definitions/mimeType"
          }
        },
        "consumes": {
          "type": "array",
          "description": "A list of MIME types the API can consume.",
          "additionalItems": false,
          "items": {
            "$ref": "#/definitions/mimeType"
          }
        },
        "parameters": {
          "type": "array",
          "description": "The parameters needed to send a valid API call.",
          "minItems": 1,
          "additionalItems": false,
          "items": {
            "oneOf": [
              {
                "$ref": "#/definitions/parameter"
              },
              {
                "type": "object",
                "additionalProperties": false,
                "properties": {
                  "$ref": {
                    "type": "string"
                  }
                }
              }
            ]
          }
        },
        "responses": {
          "$ref": "#/definitions/responses"
        },
        "schemes": {
          "type": "array",
          "description": "The transfer protocol of the API.",
          "items": {
            "type": "string",
            "enum": [
              "http",
              "https",
              "ws",
              "wss"
            ]
          }
        },
        "security": {
          "$ref": "#/definitions/securityRequirement"
        }
      }
    },
    "pathItem": {
      "type": "object",
      "additionalProperties": false,
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      },
      "properties": {
        "$ref": {
          "type": "string"
        },
        "get": {
          "$ref": "#/definitions/operation"
        },
        "put": {
          "$ref": "#/definitions/operation"
        },
        "post": {
          "$ref": "#/definitions/operation"
        },
        "delete": {
          "$ref": "#/definitions/operation"
        },
        "options": {
          "$ref": "#/definitions/operation"
        },
        "head": {
          "$ref": "#/definitions/operation"
        },
        "patch": {
          "$ref": "#/definitions/operation"
        },
        "parameters": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/parameter"
          }
        }
      }
    },
    "responses": {
      "type": "object",
      "description": "Response objects names can either be any valid HTTP status code or 'default'.",
      "minProperties": 1,
      "additionalProperties": false,
      "patternProperties": {
        "^([0-9]+)$|^(default)$": {
          "$ref": "#/definitions/response"
        },
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      }
    },
    "response": {
      "type": "object",
      "required": [
        "description"
      ],
      "properties": {
        "description": {
          "type": "string"
        },
        "schema": {
          "$ref": "#/definitions/schema"
        },
        "headers": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/serializableType"
          }
        },
        "examples": {
          "$ref": "#/definitions/example"
        }
      },
      "additionalProperties": false
    },
    "serializableType": {
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "string",
            "number",
            "boolean",
            "integer",
            "array",
            "file"
          ]
        },
        "format": {
          "type": "string"
        },
        "items": {
          "type": "object"
        },
        "collectionFormat": {
          "type": "string"
        }
      }
    },
    "vendorExtension": {
      "description": "Any property starting with x- is valid.",
      "additionalProperties": true,
      "additionalItems": true
    },
    "parameter": {
      "type": "object",
      "required": [
        "name",
        "in"
      ],
      "oneOf": [
        {
          "patternProperties": {
            "^x-": {
              "$ref": "#/definitions/vendorExtension"
            }
          },
          "properties": {
            "name": {
              "type": "string",
              "description": "The name of the parameter."
            },
            "in": {
              "type": "string",
              "description": "Determines the location of the parameter.",
              "enum": [
                "query",
                "header",
                "path",
                "formData"
              ]
            },
            "description": {
              "type": "string",
              "description": "A brief description of the parameter. This could contain examples of use.  Github-flavored markdown is allowed."
            },
            "required": {
              "type": "boolean",
              "description": "Determines whether or not this parameter is required or optional."
            },
            "type": {
              "type": "string",
              "enum": [
                "string",
                "number",
                "boolean",
                "integer",
                "array"
              ]
            },
            "format": {
              "type": "string"
            },
            "items": {
              "type": "object"
            },
            "collectionFormat": {
              "type": "string"
            }
          },
          "additionalProperties": false
        },
        {
          "patternProperties": {
            "^x-": {
              "$ref": "#/definitions/vendorExtension"
            }
          },
          "properties": {
            "name": {
              "type": "string",
              "description": "The name of the parameter."
            },
            "in": {
              "type": "string",
              "description": "Determines the location of the parameter.",
              "enum": [
                "body"
              ]
            },
            "description": {
              "type": "string",
              "description": "A brief description of the parameter. This could contain examples of use."
            },
            "required": {
              "type": "boolean",
              "description": "Determines whether or not this parameter is required or optional."
            },
            "schema": {
              "$ref": "#/definitions/schema"
            }
          },
          "additionalProperties": false
        }
      ]
    },
    "schema": {
      "type": "object",
      "description": "A deterministic version of a JSON Schema object.",
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      },
      "properties": {
        "$ref": {
          "type": "string"
        },
        "format": {
          "type": "string"
        },
        "title": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/title"
        },
        "description": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/description"
        },
        "default": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/default"
        },
        "multipleOf": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/multipleOf"
        },
        "maximum": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/maximum"
        },
        "exclusiveMaximum": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/exclusiveMaximum"
        },
        "minimum": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/minimum"
        },
        "exclusiveMinimum": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/exclusiveMinimum"
        },
        "maxLength": {
          "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveInteger"
        },
        "minLength": {
          "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveIntegerDefault0"
        },
        "pattern": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/pattern"
        },
        "discriminator": {
          "type": "string"
        },
        "xml": {
          "$ref": "#/definitions/xml"
        },
        "items": {
          "anyOf": [
            {
              "$ref": "#/definitions/schema"
            },
            {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/definitions/schema"
              }
            }
          ],
          "default": {}
        },
        "maxItems": {
          "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveInteger"
        },
        "minItems": {
          "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveIntegerDefault0"
        },
        "uniqueItems": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/uniqueItems"
        },
        "maxProperties": {
          "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveInteger"
        },
        "minProperties": {
          "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveIntegerDefault0"
        },
        "required": {
          "$ref": "http://json-schema.org/draft-04/schema#/definitions/stringArray"
        },
        "externalDocs": {
          "$ref": "#/definitions/externalDocs"
        },
        "properties": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/definitions/schema"
          },
          "default": {}
        },
        "enum": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/enum"
        },
        "type": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/type"
        },
        "example": {},
        "allOf": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/schema"
          }
        }
      }
    },
    "security": {
      "description": "defines security definitions"
    },
    "securityRequirement": {
      "description": "defines a security requirement",
      "type": "array"
    },
    "xml": {
      "properties": {
        "name": {
          "type": "string"
        },
        "namespace": {
          "type": "string"
        },
        "prefix": {
          "type": "string"
        },
        "attribute": {
          "type": "boolean"
        },
        "wrapped": {
          "type": "boolean"
        }
      },
      "additionalProperties": false
    },
    "tag": {
      "type": "object",
      "properties": {
        "externalDocs": {
          "$ref": "#/definitions/externalDocs"
        }
      },
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        },
        "^/$|^/.*[^/]$": {
          "type": "string"
        }
      }
    }
  }
}
// End of Schema JSON
);
}]);

'use strict';

PhonicsApp.config(['$provide', function ($provide) {
  $provide.constant('defaults',

  // BEGIN-DEFAUNTAS-JSON
  {
    downloadZipUrl: 'http://generator.wordnik.com/online/api/gen/download/',
    codegen: {
      servers: 'http://generator.wordnik.com/online/api/gen/servers',
      clients: 'http://generator.wordnik.com/online/api/gen/clients',
      server: 'http://generator.wordnik.com/online/api/gen/servers/{language}',
      client: 'http://generator.wordnik.com/online/api/gen/clients/{language}'
    },
    schemaUrl: '',
    examplesFolder: '/spec-files/',
    exampleFiles: ['default.yaml', 'minimal.yaml', 'heroku-pets.yaml', 'petstore.yaml'],
    backendEndpoint: '/editor/spec',
    useBackendForStorage: false,
    backendHelathCheckTimeout: 5000,
    disableFileMenu: false,
    disableCodeGen: true,
    useYamlBackend: false,
    headerBranding: false,
    brandingCssClass: ''
  }
  // END-DEFAULTS-JSON

  );
}]);

'use strict';

PhonicsApp.config(['$provide', function ($provide) {
  $provide.constant('strings', {
    stausMessages: {
      '-2': 'Unsaved Changes. Check your server connection',
      '-1': 'Error!',
      0: 'Working...',
      1: 'All changes saved.'
    }
  });
}]);

'use strict';

PhonicsApp.directive('collapseWhen', function () {
  var TRANSITION_DURATION = 200; //ms

  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {
      var buffer = null;

      function cleanUp() {
        // remove style attribute after animation
        // TDOD: just remove 'height' from style
        setTimeout(function () {
          element.removeAttr('style');
        }, TRANSITION_DURATION);
      }

      // If it's collapsed initially
      if (attrs.collapseWhen) {
        var clone = element.clone();
        clone.removeAttr('style');
        clone.appendTo('body');
        buffer = clone.height();
        clone.remove();
      }

      scope.$watch(attrs.collapseWhen, function (val) {
        if (val) {
          buffer = element.height();
          element.height(buffer);
          element.height(0);
          element.addClass('c-w-collapsed');
          cleanUp();
        } else {
          element.height(buffer);
          element.removeClass('c-w-collapsed');
          cleanUp();
        }
      });
    }
  };
});

'use strict';

PhonicsApp.controller('GeneralModal', function GeneralModal($scope, $modalInstance, data) {
  $scope.ok = $modalInstance.close;
  $scope.cancel = $modalInstance.close;
  $scope.data = data;
});

'use strict';

PhonicsApp.controller('UrlImportCtrl', function FileImportCtrl($scope, $modalInstance, FileLoader, $localStorage, Storage, Editor, FoldManager) {
  var results;

  $scope.url = null;

  $scope.fetch = function (url) {
    if (angular.isString('string') && url.indexOf('http') > -1) {
      FileLoader.loadFromUrl(url).then(function (data) {
        results = data;
        $scope.canImport = true;
      }, function (error) {
        $scope.error = error;
        $scope.canImport = false;
      });
    }
  };

  $scope.ok = function () {
    if (angular.isString(results)) {
      Storage.save('yaml', results);
      Editor.setValue(results);
      FoldManager.reset();
    }
    $modalInstance.close();
  };

  $scope.cancel = $modalInstance.close;
});

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

      // TODO: find a badass regex that can handle ' ▹ ' case without two replaces
      return error.swaggerError.message +
        ' at\n' + error.swaggerError.dataPath.replace(/\//g, ' ▹ ')
        .replace(' ▹ ', '').replace(/~1/g, '/');
    }

    if (error.yamlError) {
      return error.yamlError.message.replace('JS-YAML: ', '').replace(/./, function (a) {
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

'use strict';

PhonicsApp.controller('OpenExamplesCtrl', function OpenExamplesCtrl(FileLoader, Builder, Storage, Editor, FoldManager, defaults, $scope, $modalInstance) {

  $scope.files = defaults.exampleFiles;
  $scope.selectedFile = defaults.exampleFiles[0];

  $scope.open = function (file) {
    FileLoader.loadFromUrl('spec-files/' + file).then(function (value) {
      Storage.save('yaml', value);
      Editor.setValue(value);
      FoldManager.reset();
      $modalInstance.close();
    }, $modalInstance.close);
  };

  $scope.cancel = $modalInstance.close;
});

'use strict';

PhonicsApp.service('Backend', function Backend($http, $q, defaults, Builder) {
  var changeListeners =  Object.create(null);
  var buffer = Object.create(null);
  var commit = _.throttle(commitNow, 200, {leading: false, trailing: true});

  function commitNow(data) {
    var result = Builder.buildDocs(data, { resolve: true });
    if (!result.error) {
      $http.put(defaults.backendEndpoint, data);
    }
  }

  this.save = function (key, value) {

    // Save values in a buffer
    buffer[key] = value;

    if (Array.isArray(changeListeners[key])) {
      changeListeners[key].forEach(function (fn) {
        fn(value);
      });
    }

    if (defaults.useYamlBackend && (key === 'yaml' && value)) {
      commit(value);
    } else if (key === 'specs' && value) {
      commit(buffer[key]);
    }

  };

  this.reset = noop;

  this.load = function (key) {
    if (key !== 'yaml') {
      var deferred = $q.defer();
      if (!key) {
        deferred.reject();
      } else {
        deferred.resolve(buffer[key]);
      }
      return deferred.promise;
    }

    return $http.get(defaults.backendEndpoint)
      .then(function (res) {
        if (defaults.useYamlBackend) {
          buffer.yaml = res.data;
          return buffer.yaml;
        }
        return res.data;
      });
  };

  this.addChangeListener = function (key, fn) {
    if (angular.isFunction(fn)) {
      if (!changeListeners[key]) {
        changeListeners[key] = [];
      }
      changeListeners[key].push(fn);
    }
  };

  function noop() {}
});
