'use strict';

SwaggerEditor.controller('DownloadDocsCtrl', function DownloadDocsCtrl($scope,
  $modalInstance, $rootScope, Embedded, Storage) {

  $scope.cancel = $modalInstance.close;

  $scope.generate = function () {
    var MIME_TYPE = 'text/html';

    $scope.ready = false;

    Storage.load('yaml').then(function (yaml) {
      Embedded.template(yaml).then(function (result) {
        var blob = new Blob([result], {type: MIME_TYPE});

        $scope.downloadHref = window.URL.createObjectURL(blob);
        $scope.downloadUrl = [
          MIME_TYPE,
          'swagger.html',
          $scope.downloadHref
        ].join(':');
        $scope.ready = true;
        $scope.$digest();
      });
    });
  };

  // Invoke generate on modal open
  $scope.generate();
});
