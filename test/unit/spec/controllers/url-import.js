'use strict';

var angular = require('angular');

describe('Controller: UrlImportCtrl', function() {

  // load the controller's module
  beforeEach(angular.mock.module('SwaggerEditor'));

  var UrlImportCtrl;
  var $uibModalInstance;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    // Create a mock object using spies
    var callback = sinon.spy();
    $uibModalInstance = {
      close: callback,
      dismiss: callback,
      result: {
        then: callback
      }
    };
    UrlImportCtrl = $controller('UrlImportCtrl', {
      $scope: scope,
      $uibModalInstance: $uibModalInstance
    });
  }));

  it('should have a scope', function() {
    expect(!!scope).to.equal(true);
  });
});
