'use strict';

var angular = require('angular');

describe('Controller: FileImportCtrl', function() {
  // load the controller's module
  beforeEach(angular.mock.module('SwaggerEditor'));

  var modalInstance;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    var callback = sinon.spy();
    modalInstance = {                    // Create a mock object using spies
      close: callback,
      dismiss: callback,
      result: {
        then: callback
      }
    };
    $controller('FileImportCtrl', {
      $scope: scope,
      $uibModalInstance: modalInstance
    });
  }));

  it('should have a scope', function() {
    expect(Boolean(scope)).to.equal(true);
  });
});
