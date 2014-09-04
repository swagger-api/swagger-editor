'use strict';

PhonicsApp.controller('HeaderCtrl', function HeaderCtrl($scope, Editor, Storage, Splitter, Builder, $modal, $stateParams, defaults, $timeout) {

  if ($stateParams.path) {
    $scope.breadcrumbs  = [{ active: true, name: $stateParams.path }];
  } else {
    $scope.breadcrumbs  = [];
  }

  var statusTimeout;
  Storage.addChangeListener('progress', function (progressStatus) {
    var statusClassHash = {
      'Saved.': 'success',
      'Error!': 'error'
    };
    $scope.status = progressStatus;
    $scope.statusClass = statusClassHash[progressStatus];

    // Remove the status if it's "Saved" status
    if (progressStatus === 'Saved.') {
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

  $scope.generateZip = function (type, kind) {
    var urlTemplate = _.template(defaults.apiGenUrl);
    var url = urlTemplate({type: type, kind: kind});
    var specs = jsyaml.load(Editor.getValue());

    getZipFile(url, specs);
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

  function getZipFile(url, json) {
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: url,
      data: angular.toJson(json),
      processData: false
    }).then(function (data) {
      if (data instanceof Object && data.code) {
        window.location = defaults.downloadZipUrl + data.code;
      }
    });
  }
});
