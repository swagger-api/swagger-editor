'use strict';

SwaggerEditor.controller('HeaderCtrl', function HeaderCtrl($scope, $modal,
  $stateParams, $state, $rootScope, Storage, Builder, FileLoader, ASTManager,
  Editor, Codegen, Preferences, defaults, strings, $localStorage) {

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
      $scope.status = '✔️ ' + $scope.status;
    }

    if (progressStatus < 0) {
      $scope.statusClass = 'error';
      $scope.status = '❌' + $scope.status;
    }
  });

  // Show the intro if it's first time visit
  $localStorage.$default({
    showIntro: !defaults.disableNewUserIntro
  });
  $rootScope.showAbout = $localStorage.showIntro;

  // -- Client and Server menus
  $scope.disableCodeGen = defaults.disableCodeGen;

  if (!defaults.disableCodeGen) {
    Codegen.getServers().then(function (servers) {
      $scope.servers = servers;
    });

    Codegen.getClients().then(function (clients) {
      $scope.clients = clients;
    });
  }

  $scope.getSDK = function (type, language) {
    Codegen.getSDK(type, language).then(noop, showCodegenError);
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
    FileLoader.loadFromUrl('spec-files/guide.yaml').then(function (value) {
      $rootScope.editorValue = value;
      ASTManager.refresh($rootScope.editorValue);
      Storage.save('yaml', value);
    });
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

  $scope.openPasteJSON = function () {
    $modal.open({
      templateUrl: 'templates/paste-json.html',
      controller: 'PasteJSONCtrl',
      size: 'large'
    });
  };

  $scope.openAbout = function () {
    $modal.open({
      templateUrl: 'templates/about.html',
      size: 'large',
      controller: 'ModalCtrl'
    });
  };

  $rootScope.toggleAboutEditor = function (value) {
    $rootScope.showAbout = value;
    $localStorage.showIntro = value;
  };

  $scope.openEditorPreferences = Editor.showSettings;
  $scope.resetSettings = Editor.resetSettings;
  $scope.adjustFontSize = Editor.adjustFontSize;

  $scope.openExamples = function () {
    $modal.open({
      templateUrl: 'templates/open-examples.html',
      controller: 'OpenExamplesCtrl',
      size: 'large'
    });
  };

  $scope.toggleLiveRender = function () {
    Preferences.set('liveRender', !Preferences.get('liveRender'));
  };

  $scope.isLiveRenderEnabled = function () {
    return !!Preferences.get('liveRender');
  };

  /*
   * Should show editor related menu options?
  */
  $scope.showEditorMenuOptions = function () {
    return $rootScope.mode === 'edit';
  };

  function assignDownloadHrefs() {
    var MIME_TYPE = 'text/plain';

    Storage.load('yaml').then(function (yaml) {

      // JSON
      var json = jsyaml.load(yaml);

      // if `yaml` is JSON, convert it to YAML
      try {
        JSON.parse(yaml);
        yaml = jsyaml.dump(jsyaml.load(yaml));
      } catch (error) {
        // if JSON.parse throws it means `yaml` is not JSON so we leave it as is
      }

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
    });
  }

  $scope.capitalizeGeneratorName = function (name) {
    var names = {
      jaxrs: 'JAX-RS',
      nodejs: 'Node.js',
      scalatra: 'Scalatra',
      'spring-mvc': 'Spring MVC',
      android: 'Android',
      'async-scala': 'Async Scala',
      csharp: 'C#',
      java: 'Java',
      objc: 'Objective-C',
      php: 'PHP',
      python: 'Python',
      ruby: 'Ruby',
      scala: 'Scala',
      'dynamic-html': 'Dynamic HTML',
      html: 'HTML',
      swagger: 'Swagger JSON',
      'swagger-yaml': 'Swagger YAML',
      tizen: 'Tizen'
    };

    if (names[name]) {
      return names[name];
    }

    return name.split(/\s+|\-/).map(function (word) {
      return word[0].toUpperCase() + word.substr(1);
    }).join(' ');
  };

  function noop() {

  }
});
