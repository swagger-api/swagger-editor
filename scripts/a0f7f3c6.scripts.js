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
  'hc.marked'
]);

'use strict';

PhonicsApp.config(function Router($compileProvider, $stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('home', {
    url: '',
    views: {
      '': {
        templateUrl: 'views/main.html',
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
  })
    .state('home.path', {
      url: '/paths?path',
      views: {
        header: {
          templateUrl: 'views/header/header.html',
          controller: 'HeaderCtrl'
        },
        editor: {
          templateUrl: 'views/editor/editor.html',
          controller: 'EditorCtrl'
        },
        preview: {
          templateUrl: 'views/preview/preview.html',
          controller: 'PreviewCtrl'
        }
      }
    });
      // .state('home.path.operation', {
      //   url: ':operationId',
      //   views: {
      //     'preview@home.path.operation': {
      //       controller: 'PreviewCtrl',
      //       templateUrl: 'views/preview/preview.html'
      //     }
      //   }
      // });

  $compileProvider.aHrefSanitizationWhitelist('.');
});

'use strict';

PhonicsApp.controller('MainCtrl', function MainCtrl($rootScope, Editor, Storage, FileLoader, BackendHealthCheck, defaults) {
  $rootScope.$on('$stateChangeStart', Editor.initializeEditor);

  // If there is no saved YAML load the default YAML file
  Storage.load('yaml').then(function (yaml) {
    if (!yaml) {
      var url = defaults.examplesFolder + defaults.exampleFiles[0];
      FileLoader.loadFromUrl(url).then(function (yaml) {
        if (yaml) {
          Storage.save('yaml', yaml);
          Editor.setValue(yaml);
        }
      });
    }
  });

  BackendHealthCheck.startChecking();

  // TODO: find a better way to add the branding class (grunt html template)
  $('body').addClass(defaults.brandingCssClass);
});

'use strict';

PhonicsApp.controller('HeaderCtrl', function HeaderCtrl($scope, Editor, Storage, Splitter, Builder, Codegen, $modal, $stateParams, defaults, strings, $timeout) {

  if ($stateParams.path) {
    $scope.breadcrumbs  = [{ active: true, name: $stateParams.path }];
  } else {
    $scope.breadcrumbs  = [];
  }

  var statusTimeout;
  Storage.addChangeListener('progress', function (progressStatus) {
    $scope.status = strings.stausMessages[progressStatus];
    $scope.statusClass = null;

    if (progressStatus > 0) {
      $scope.statusClass = 'success';
    }

    if (progressStatus < 0) {
      $scope.statusClass = 'error';
    }

    // Remove the status if it's "Saved" status
    if (progressStatus > 0) {
      statusTimeout = $timeout(function () {
        $scope.status = null;
      }, 1000);
    } else {
      $timeout.cancel(statusTimeout);
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

  $scope.togglePane = function (side) {
    Splitter.toggle(side);
  };

  $scope.isPaneVisible = function (side) {
    return Splitter.isVisible(side);
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
      var json = JSON.stringify(jsyaml.load(yaml), null, 4);
      var jsonBlob = new Blob([json], {type: MIME_TYPE});
      $scope.jsonDownloadHref = window.URL.createObjectURL(jsonBlob);
      $scope.jsonDownloadUrl = [MIME_TYPE, 'spec.json', $scope.jsonDownloadHref].join(':');

      // YAML
      var yamlBlob = new Blob([yaml], {type: MIME_TYPE});
      $scope.yamlDownloadHref = window.URL.createObjectURL(yamlBlob);
      $scope.yamlDownloadUrl = [MIME_TYPE, 'spec.yaml', $scope.yamlDownloadHref].join(':');
    });
  }

  function noop() {

  }
});

'use strict';

PhonicsApp.directive('splitterBar', ['Splitter', function (splitter) {
  var ANIMATION_DURATION = 400;

  function registerVerticalPanes($element) {
    splitter.registerSide('left', $element.offsetLeft);
    splitter.registerSide('right', window.innerWidth - $element.offsetLeft - 4);
  }

  return {
    template: '',
    replace: false,
    restrict: 'E',
    link: function ($scope, $element, $attributes) {
      var $document = $(document);
      var $parent = $element.parent();
      if (!('horizontal' in $attributes)) {
        registerVerticalPanes($element.get(0));
      }

      splitter.addHideListener('left', function () {
        $('#' + $attributes.leftPane).animate({width: 0}, ANIMATION_DURATION);
        $('#' + $attributes.rightPane).animate({width: window.innerWidth}, ANIMATION_DURATION, function () {
          $document.trigger('pane-resize');
        });
        $element.hide();
      });

      splitter.addShowListener('left', function (width) {
        $('#' + $attributes.leftPane).animate({width: width}, ANIMATION_DURATION);
        $('#' + $attributes.rightPane).animate({width: window.innerWidth - width - 4}, ANIMATION_DURATION, function () {
          $('#' + $attributes.rightPane).css('overflow', 'auto');
          $element.show();
          $document.trigger('pane-resize');
        });
      });

      splitter.addHideListener('right', function () {
        $('#' + $attributes.rightPane).animate({width: 0}, ANIMATION_DURATION);
        $('#' + $attributes.leftPane).animate({width: window.innerWidth}, ANIMATION_DURATION, function () {
          $document.trigger('pane-resize');
        });
        $element.hide();
      });

      splitter.addShowListener('right', function (width) {
        $('#' + $attributes.rightPane).animate({width: width}, ANIMATION_DURATION);
        $('#' + $attributes.leftPane).animate({width: window.innerWidth - width}, ANIMATION_DURATION, function () {
          $('#' + $attributes.rightPane).css('overflow', 'auto');
          $element.show();
          $document.trigger('pane-resize');
        });
      });

      function resize(mouseMoveEvent) {
        var x = mouseMoveEvent.pageX - $parent.offset().left;
        var y = mouseMoveEvent.pageY - $parent.offset().top;
        x = x || window.innerWidth / 2;
        y = y || window.innerHeight / 2;
        var MIN_SIZE = 100;
        if ('horizontal' in $attributes) {
          if (y < MIN_SIZE || y > $parent.height() - MIN_SIZE) {
            return;
          }
          $document.trigger('pane-resize');
          $element.css('top', y);
          $('#' + $attributes.topPane).css('height', y + $element.height());
          $('#' + $attributes.bottomPane).css('height',
            $parent.height() - y);
        } else {
          if (x < MIN_SIZE || x > $parent.width() - MIN_SIZE) {
            return;
          }
          $document.trigger('pane-resize');
          $element.css('left', x);
          $('#' + $attributes.leftPane).css('width', x);
          $('#' + $attributes.rightPane).css('width',
            $parent.width() - x - $element.width());
          registerVerticalPanes($element.get(0));
        }
      }
      $element.on('mousedown', function (mousedownEvent) {
        mousedownEvent.preventDefault();
        $document.on('mousemove', resize);
        $document.on('mouseup', function () {
          $document.off('mousemove', resize);
        });
      });
      $(window).on('resize', _.throttle(resize, 300));
    }
  };
}]);

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

function stringifySchema(schema) {
  if (!schema) {
    return '';
  }

  var str = '';

  if (schema.type) {

    // If it's an array, wrap it around []
    if (schema.type === 'array') {
      str = '[' + stringifySchema(schema.items) + ']';

    // Otherwise use schema type solely
    } else if (schema.type) {
      str = '"' + schema.type + '"';
    }
  }

  // If there is a format for this schema add append it
  if (schema.format) {
    str += '(' + schema.format + ')';

  // If this schema has properties and no format, build upon properties
  } else if (typeof schema.properties === 'object') {
    var propsStr = '';
    for (var property in schema.properties) {
      propsStr += '  ' + buildProperty(property, schema) + '\n';
    }
    str += propsStr;

  // If it's a custom model (object wrapping an schema with a single key)
  // unwrap it and pre-pend the key
  } else if (typeof schema === 'object' && Object.keys(schema).length === 1) {
    var key = Object.keys(schema)[0];

    // If this single keyed object just is 'type' it's not
    // custom model.
    if (key !== 'type') {
      str += key + ': {\n' +
        stringifySchema(schema[key]) +
        '}';
    }
  }

  return str;
}

function buildProperty(property, schema) {

  // ignore vendor extensions
  if (property.toLowerCase().indexOf('x-') === 0) {
    return '';
  }

  var result = property + ': ' +
    stringifySchema(schema.properties[property]);
  if (angular.isObject(schema.required) && _.toArray(schema.required).indexOf(property) > -1) {
    result += ' <required>';
  }
  return result;
}

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
  .directive('schemaModel', function () {
    return {
      templateUrl: 'templates/schema-model.html',
      restrict: 'E',
      replace: true,
      scope: {
        schema: '='
      },
      link: function postLink(scope) {
        scope.mode = 'model';

        scope.getJson = function () {
          return removeVendorExtensions(scope.schema);
        };

        scope.getString = function () {
          return stringifySchema(removeVendorExtensions(scope.schema));
        };
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

PhonicsApp.service('Splitter', function Splitter() {
  var sides = {
    left: { width: null, visible: false, hideListeners: [], showListeners: []},
    right: { width: null, visible: false, hideListeners: [], showListeners: []}
  };
  var that = this;

  this.toggle = function (side) {
    sides[side].visible = !sides[side].visible;
    if (!sides[side].visible) {
      that.hidePane(side);
    } else {
      that.showPane(side);
    }
  };

  this.registerSide = function (side, width, invisible) {
    sides[side].width = width;
    sides[side].visible = !invisible;
  };

  this.addHideListener = function (side, fn) {
    sides[side].hideListeners.push(fn);
  };

  this.addShowListener = function (side, fn) {
    sides[side].showListeners.push(fn);
  };

  this.hidePane = function (side) {
    sides[side].hideListeners.forEach(function (listener) {
      listener();
    });
  };

  this.showPane = function (side) {
    sides[side].showListeners.forEach(function (listener) {
      listener(sides[side].width);
    });
  };

  this.isVisible = function (side) {
    return sides[side] && sides[side].visible;
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
    if (typeof value === 'string') {
      editor.getSession().setValue(value);
    }

    // If it's an object, convert it YAML
    if (typeof value === 'object') {
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
    if (typeof fn === 'function') {
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

PhonicsApp.service('Builder', function Builder(Resolver, Validator) {
  var load = _.memoize(jsyaml.load);

  function buildDocs(stringValue, options) {

    var json;

    if (!stringValue) {
      return {
        specs: null,
        error: {emptyDocsError: { message: 'Empty Document'}}
      };
    }

    try {
      json = load(stringValue);
    } catch (e) {
      return {
        error: { yamlError: e },
        specs: null
      };
    }
    return buildDocsWithObject(json, options);
  }

  function buildDocsWithObject(json, options) {
    options = options || {};

    if (!json) {
      return {
        specs: null,
        error: {emptyDocsError: { message: 'Empty Document'}}
      };
    }

    // Validate if specs are resolvable
    try {
      Resolver.resolve(json);
    } catch (e) {
      return {
        error: { resolveError: e },
        specs: null
      };
    }

    if (options.resolve) {
      json = Resolver.resolve(json);
    }
    var result = { specs: json };
    var error = Validator.validateSwagger(json);

    if (error && error.swaggerError) {
      result.error = error;
    }

    return result;
  }

  /*
   * Gets a path JSON object and Specs, finds the path in the
   * specs JSON and updates it
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
PhonicsApp.service('Validator', function Validator(defaultSchema) {
  var buffer = Object.create(null);

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
    schema = schema || defaultSchema;
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
PhonicsApp.service('Resolver', function Resolver() {

  /*
  ** gets a JSON object and recursively resolve all $ref references
  ** root object is being passed to get the actual result of the
  ** $ref reference
  ** path is an array of keys to the current object from root.
  */
  function resolve(json, root, path) {

    // If it's first time resolve is being called there would be no path
    // initialize it
    if (!Array.isArray(path)) {
      path = [];
    }

    // If it's first time resolve being called root would be the same object
    // as json
    if (!root) {
      root = json;
    }

    // If json is an array, iterate in the array and apply resolve to each element
    // of the array and return it
    if (Array.isArray(json)) {
      return json.map(function (item) {
        return resolve(item, root);
      });
    }

    // if json is not an object we can't resolve it. The json itself is resolved json
    if (typeof json !== 'object') {
      return json;
    }

    // If json is typeof object but is not a real object (null) throw resolve error
    if (!angular.isObject(json)) {
      throw new Error('Can not resolve ' + path.join(' ▹ '));
    }

    // Initialize resolved object
    var result = {};

    // For each key in json check if the key is a resolve key ($ref)
    Object.keys(json).forEach(function (key) {
      if (angular.isObject(json[key]) && json[key].$ref) {

        // if it's a resolvable key, look it up and put it in result object
        result[key] = lookup(json[key].$ref, root);
      } else {

        // otherwise recursively resolve it
        result[key] = resolve(json[key], root, path.concat(key));
      }
    });

    return result;
  }

  /*
  ** With a given JSON-Schema address and an object (root) returns
  ** the object that $ref address is pointing too
  ** //TODO: resolve HTTP based addresses
  */
  function lookup(address, root) {

    // If address is a shorthand without #definition and not a http address
    // make the address a longhand addrsss
    if (address.indexOf('#/') !== 0 && address.indexOf('http://') !== 0) {
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
        throw new Error('Can not lookup ' + key + ' in ' + angular.toJson(current));
      }
      current = current[key];
    }
    return current;
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

  $(document).on('pane-resize', Editor.resize.bind(Editor));

  function onAceChange() {
    var value = Editor.getValue();

    Storage.save('yaml', value);
    FoldManager.refresh();
  }
});

'use strict';

PhonicsApp.controller('PreviewCtrl', function PreviewCtrl(Storage, Builder, FoldManager, Sorter, Editor, Operation, BackendHealthCheck, $scope) {
  function update(latest) {

    // If backend is not healthy don't update
    if (!BackendHealthCheck.isHealthy()) {
      return;
    }

    var specs = null;
    var result = null;

    result = Builder.buildDocs(latest, { resolve: true });
    specs = FoldManager.extendSpecs(result.specs);
    $scope.specs = Sorter.sort(specs);

    if (result.error) {
      if (result.error.yamlError) {
        Editor.annotateYAMLErrors(result.error.yamlError);
      }
      $scope.error = result.error;
      Storage.save('progress', -1); // Error
    } else {
      $scope.error = null;
      Editor.clearAnnotation();
      Storage.save('progress',  1); // Saved
    }
  }

  Storage.addChangeListener('yaml', update);

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
    if (typeof fn === 'function') {
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
  "required": [ "swagger", "info", "paths" ],

  "definitions": {
    "info": {
      "type": "object",
      "description": "General information about the API.",
      "required": [ "version", "title" ],
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
          "description": "A longer description of the API. Should be different from the title."
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
          "required": [ "name" ],
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
        "^[a-z0-9-]+/[a-z0-9-+]+$": {}
      },
      "additionalProperties": false
    },
    "mimeType": {
      "type": "string",
      "pattern": "^[a-z0-9-]+/[a-z0-9-+]+$",
      "description": "The MIME type of the HTTP message."
    },
    "operation": {
      "type": "object",
      "required": [ "responses" ],
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
          "description": "A longer description of the operation, markdown is allowed."
        },
        "docsUrl": {
          "type": "string",
          "format": "uri",
          "description": "Location of external documentation."
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
        "parameters": {
          "type": "array",
          "description": "The parameters needed to send a valid API call.",
          "minItems": 1,
          "additionalItems": false,
          "items": {
            "$ref": "#/definitions/parameter"
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
            "enum": [ "http", "https", "ws", "wss" ]
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
      "required": [ "description" ],
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
          "enum": [ "string", "number", "boolean", "integer", "array" ]
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
      "required": [ "name", "in" ],
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
              "enum": [ "query", "header", "path", "formData" ],
              "default": "query"
            },
            "description": {
              "type": "string",
              "description": "A brief description of the parameter. This could contain examples of use."
            },
            "required": {
              "type": "boolean",
              "description": "Determines whether or not this parameter is required or optional."
            },
            "type": {
              "type": "string",
              "enum": [ "string", "number", "boolean", "integer", "array" ]
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
              "enum": [ "body" ],
              "default": "body"
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
        "$ref": { "type": "string" },
        "format": { "type": "string" },
        "title": { "$ref": "http://json-schema.org/draft-04/schema#/properties/title" },
        "description": { "$ref": "http://json-schema.org/draft-04/schema#/properties/description" },
        "default": { "$ref": "http://json-schema.org/draft-04/schema#/properties/default" },
        "multipleOf": { "$ref": "http://json-schema.org/draft-04/schema#/properties/multipleOf" },
        "maximum": { "$ref": "http://json-schema.org/draft-04/schema#/properties/maximum" },
        "exclusiveMaximum": { "$ref": "http://json-schema.org/draft-04/schema#/properties/exclusiveMaximum" },
        "minimum": { "$ref": "http://json-schema.org/draft-04/schema#/properties/minimum" },
        "exclusiveMinimum": { "$ref": "http://json-schema.org/draft-04/schema#/properties/exclusiveMinimum" },
        "maxLength": { "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveInteger" },
        "minLength": { "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveIntegerDefault0" },
        "pattern": { "$ref": "http://json-schema.org/draft-04/schema#/properties/pattern" },
        "discriminator": { "type": "string" },
        "xml": { "$ref": "#/definitions/xml"},
        "items": {
          "anyOf": [
            { "$ref": "#/definitions/schema" },
            {
              "type": "array",
              "minItems": 1,
              "items": { "$ref": "#/definitions/schema" }
            }
          ],
          "default": { }
        },
        "maxItems": { "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveInteger" },
        "minItems": { "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveIntegerDefault0" },
        "uniqueItems": { "$ref": "http://json-schema.org/draft-04/schema#/properties/uniqueItems" },
        "maxProperties": { "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveInteger" },
        "minProperties": { "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveIntegerDefault0" },
        "required": { "$ref": "http://json-schema.org/draft-04/schema#/definitions/stringArray" },
        "definitions": {
          "type": "object",
          "additionalProperties": { "$ref": "#/definitions/schema" },
          "default": { }
        },
        "properties": {
          "type": "object",
          "additionalProperties": { "$ref": "#/definitions/schema" },
          "default": { }
        },
        "enum": { "$ref": "http://json-schema.org/draft-04/schema#/properties/enum" },
        "type": { "$ref": "http://json-schema.org/draft-04/schema#/properties/type" },
        "allOf": {
          "type": "array",
          "minItems": 1,
          "items": { "$ref": "#/definitions/schema" }
        }
      }
    },
    "xml": {
      "properties": {
        "namespace": { "type": "string" },
        "prefix": { "type": "string" },
        "attribute": { "type": "boolean" },
        "wrapped": { "type": "boolean" }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false,
  "patternProperties": {
    "^x-": {
      "$ref": "#/definitions/vendorExtension"
    }
  },
  "properties": {
    "swagger": {
      "type": "number",
      "enum": [ 2.0 ],
      "description": "The Swagger version of this document."
    },
    "info": {
      "$ref": "#/definitions/info"
    },
    "host": {
      "type": "string",
      "format": "uri",
      "pattern": "^((?!\\:\/\/).)*$",
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
        "enum": [ "http", "https", "ws", "wss" ]
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
      "description": "Relative paths to the individual endpoints. They should be relative to the 'basePath'.",

      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      },

      "additionalProperties": {
        "type": "object",
        "minProperties": 1,
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
      }
    },
    "definitions": {
      "type": "object",
      "description": "One or more JSON objects describing the schemas being consumed and produced by the API.",
      "additionalProperties": {
        "$ref": "#/definitions/schema"
      }
    },
    "security": {
      "type": "array"
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
      client: 'http://generator.wordnik.com/online/api/gen/client/{language}'
    },
    examplesFolder: '/spec-files/',
    exampleFiles: ['default.yaml', 'minimal.yaml', 'heroku-pets.yaml', 'uber.yaml'],
    backendEndpoint: '/editor/spec',
    useBackendForStorage: false,
    backendHelathCheckTimeout: 5000,
    disableFileMenu: false,
    disableCodeGen: false,
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
    if (typeof url === 'string' && url.indexOf('http') > -1) {
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

  $scope.getError = function () {
    var error = $scope.$parent.error;

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

    if (error.swaggerError && typeof error.swaggerError.dataPath === 'string') {

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
      return error.resolveError.message.replace(/ in \{.+/, '');
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
    if (typeof fn === 'function') {
      if (!changeListeners[key]) {
        changeListeners[key] = [];
      }
      changeListeners[key].push(fn);
    }
  };

  function noop() {}
});
