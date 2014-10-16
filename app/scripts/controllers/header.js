'use strict';

PhonicsApp.controller('HeaderCtrl', function HeaderCtrl($scope, Editor, Storage,
  Builder, Codegen, $modal, $stateParams, $state, defaults, strings) {

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
    Editor.setValue('swagger: \'2.0\'');
    $state.go('home', {mode: 'edit'});
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

  function noop() {

  }
});
