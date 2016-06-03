'use strict';

SwaggerEditor.controller('HeaderCtrl', function HeaderCtrl($scope, $uibModal,
  $stateParams, $state, $rootScope, Storage, Builder, FileLoader, Editor,
  Codegen, Preferences, YAML, defaults, strings, $localStorage) {
  if ($stateParams.path) {
    $scope.breadcrumbs = [{active: true, name: $stateParams.path}];
  } else {
    $scope.breadcrumbs = [];
  }

  // var statusTimeout;
  $rootScope.$watch('progressStatus', function(progressStatus) {
    var status = strings.stausMessages[progressStatus];
    var statusClass = null;

    if (/success/.test(progressStatus)) {
      statusClass = 'success';
    }

    if (/error/.test(progressStatus)) {
      statusClass = 'error';
    }

    if (/working/.test(progressStatus)) {
      statusClass = 'working';
    }

    $scope.status = status;
    $scope.statusClass = statusClass;
  });

  // Show the intro if it's first time visit
  $localStorage.$default({
    showIntro: !defaults.disableNewUserIntro
  });
  $rootScope.showAbout = $localStorage.showIntro;

  // -- Client and Server menus
  $scope.disableCodeGen = defaults.disableCodeGen;

  if (!defaults.disableCodeGen) {
    Codegen.getServers().then(function(servers) {
      $scope.servers = servers;
    }, function() {
      $scope.serversNotAvailable = true;
    });

    Codegen.getClients().then(function(clients) {
      $scope.clients = clients;
    }, function() {
      $scope.clientsNotAvailable = true;
    });
  }

  $scope.getSDK = function(type, language) {
    Codegen.getSDK(type, language).then(noop, showCodegenError);
  };

  /**
   * @param {object} resp - response
  */
  function showCodegenError(resp) {
    $uibModal.open({
      template: require('templates/code-gen-error-modal.html'),
      controller: 'GeneralModal',
      size: 'large',
      resolve: {
        data: function() {
          if (resp.data) {
            return resp.data;
          }

          return resp.config;
        }
      }
    });
  }

  $scope.showFileMenu = function() {
    return !defaults.disableFileMenu;
  };

  $scope.showHeaderBranding = function() {
    return defaults.headerBranding;
  };

  $scope.newProject = function() {
    FileLoader.loadFromUrl('spec-files/guide.yaml').then(function(value) {
      $rootScope.editorValue = value;
      Storage.save('yaml', value);
      $state.go('home', {tags: null});
    });
  };

  $scope.onFileMenuOpen = function() {
    assignDownloadHrefs();
    $rootScope.$broadcast('toggleWatchers', false);
  };

  $scope.openImportFile = function() {
    $uibModal.open({
      template: require('templates/file-import.html'),
      controller: 'FileImportCtrl',
      size: 'large'
    });
  };

  $scope.openImportUrl = function() {
    $uibModal.open({
      template: require('templates/url-import.html'),
      controller: 'UrlImportCtrl',
      size: 'large'
    });
  };

  $scope.openPasteJSON = function() {
    $uibModal.open({
      template: require('templates/paste-json.html'),
      controller: 'PasteJSONCtrl',
      size: 'large'
    });
  };

  $scope.openAbout = function() {
    $uibModal.open({
      template: require('templates/about.html'),
      size: 'large',
      controller: 'ModalCtrl'
    });
  };

  $rootScope.toggleAboutEditor = function(value) {
    $rootScope.showAbout = value;
    $localStorage.showIntro = value;
  };

  $scope.openEditorPreferences = Editor.showSettings;
  $scope.resetSettings = function() {
    $uibModal.open({
      template: require('templates/reset-editor.html'),
      controller: 'ConfirmReset',
      size: 'large'
    });
  };
  $scope.adjustFontSize = Editor.adjustFontSize;

  $scope.openExamples = function() {
    $uibModal.open({
      template: require('templates/open-examples.html'),
      controller: 'OpenExamplesCtrl',
      size: 'large'
    });
  };

  $scope.openPreferences = function() {
    $uibModal.open({
      template: require('templates/preferences.html'),
      controller: 'PreferencesCtrl',
      size: 'large'
    });
  };

  $scope.isLiveRenderEnabled = function() {
    return Boolean(Preferences).get('liveRender');
  };

  /** */
  function assignDownloadHrefs() {
    var MIME_TYPE = 'text/plain';

    var yaml = $rootScope.editorValue;
    YAML.load(yaml, function(error, json) {
      // Don't assign if there is an error
      if (error) {
        return;
      }

      // if `yaml` is JSON, convert it to YAML
      var jsonParseError = null;
      try {
        JSON.parse(yaml);
      } catch (error) {
        jsonParseError = error;
      }

      var assign = function(yaml, json) {
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
        $scope.jsonDownloadUrl = [
          MIME_TYPE,
          'swagger.json',
          $scope.jsonDownloadHref
        ].join(':');

        // YAML
        var yamlBlob = new Blob([yaml], {type: MIME_TYPE});
        $scope.yamlDownloadHref = window.URL.createObjectURL(yamlBlob);
        $scope.yamlDownloadUrl = [
          MIME_TYPE,
          'swagger.yaml',
          $scope.yamlDownloadHref
        ].join(':');
      };

      if (jsonParseError) {
        assign(yaml, json);
      } else {
        YAML.dump(json, function(error, yamlStr) {
          assign(yamlStr, json);
        });
      }
    });
  }

  $scope.capitalizeGeneratorName = function(name) {
    var names = {
      'jaxrs': 'JAX-RS',
      'nodejs-server': 'Node.js',
      'scalatra': 'Scalatra',
      'spring-mvc': 'Spring MVC',
      'android': 'Android',
      'async-scala': 'Async Scala',
      'csharp': 'C#',
      'CsharpDotNet2': 'C# .NET 2.0',
      'qt5cpp': 'Qt 5 C++',
      'java': 'Java',
      'objc': 'Objective-C',
      'php': 'PHP',
      'python': 'Python',
      'ruby': 'Ruby',
      'scala': 'Scala',
      'dynamic-html': 'Dynamic HTML',
      'html': 'HTML',
      'swagger': 'Swagger JSON',
      'swagger-yaml': 'Swagger YAML',
      'tizen': 'Tizen'
    };

    if (names[name]) {
      return names[name];
    }

    return name.split(/\s+|\-/).map(function(word) {
      return word[0].toUpperCase() + word.substr(1);
    }).join(' ');
  };

  /** */
  function noop() {

  }
});
