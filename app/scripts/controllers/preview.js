'use strict';

PhonicsApp.controller('PreviewCtrl', function PreviewCtrl(Storage, Builder, FoldManager, $scope, $stateParams) {
  function updateSpecs(latest) {
    var specs = null;

    if ($stateParams.path) {
      $scope.specs = { paths: Builder.getPath(latest, $stateParams.path) };
      $scope.isSinglePath = true;
    } else {
      specs = Builder.buildDocs(latest, { resolve: true }).specs;
      $scope.specs = FoldManager.extendSpecs(specs);
    }
  }
  function updateError(latest) {
    $scope.error = latest;
  }

  Storage.addChangeListener('yaml', updateSpecs);
  Storage.addChangeListener('error', updateError);

  FoldManager.onFoldStatusChanged(function () {
    _.defer(function () { $scope.$apply(); });
  });
  $scope.toggle = FoldManager.toggleFold;
  $scope.isCollapsed = FoldManager.isFolded;

  // TODO: Move to a service
  $scope.getEditPath = function (pathName) {
    return '#/paths?path=' + window.encodeURIComponent(pathName);
  };

  $scope.responseCodeClassFor = function (code) {
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
  $scope.isVendorExtension = function (key) {
    return key.substring(0, 2).toLowerCase() === 'x-';
  };

});
