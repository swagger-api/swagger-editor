'use strict';

describe('Controller: UrlImportCtrl', function () {

  // load the controller's module
  beforeEach(window.angular.mock.module('SwaggerEditor'));

  var UrlImportCtrl,
    $modalInstance,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();

    // Create a mock object using spies
    var callback = sinon.spy();
    $modalInstance = {
      close: callback,
      dismiss: callback,
      result: {
        then: callback
      }
    };
    UrlImportCtrl = $controller('UrlImportCtrl', {
      $scope: scope,
      $modalInstance: $modalInstance
    });
  }));

  it('should have a scope', function () {
    expect(!!scope).to.equal(true);

  });
});
