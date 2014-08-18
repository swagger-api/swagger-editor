'use strict';

describe('Controller: ImporturlCtrl', function () {

  // load the controller's module
  beforeEach(module('koknusApp'));

  var ImporturlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ImporturlCtrl = $controller('ImporturlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
