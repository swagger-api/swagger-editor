'use strict';

describe('Controller: FileImportCtrl', function () {

  // load the controller's module
  beforeEach(window.angular.mock.module('SwaggerEditor'));

  var FileImportCtrl,
    modalInstance,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    var callback = sinon.spy();
    modalInstance = {                    // Create a mock object using spies
      close: callback,
      dismiss: callback,
      result: {
        then: callback
      }
    };
    FileImportCtrl = $controller('FileImportCtrl', {
      $scope: scope,
      $modalInstance: modalInstance
    });
  }));

  it('should have a scope', function () {
    expect(!!scope).to.equal(true);

  });
});
