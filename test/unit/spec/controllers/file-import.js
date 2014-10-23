'use strict';

describe('Controller: FileImportCtrl', function () {

  // load the controller's module
  beforeEach(window.angular.mock.module('PhonicsApp'));

  var FileImportCtrl,
    modalInstance,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    modalInstance = {                    // Create a mock object using spies
      close: jasmine.createSpy('modalInstance.close'),
      dismiss: jasmine.createSpy('modalInstance.dismiss'),
      result: {
        then: jasmine.createSpy('modalInstance.result.then')
      }
    };
    FileImportCtrl = $controller('FileImportCtrl', {
      $scope: scope,
      $modalInstance: modalInstance
    });
  }));

  it('should have a scope', function () {
    expect(!!scope).toBe(true);

  });
});
