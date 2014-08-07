'use strict';

describe('Controller: PreviewCtrl', function () {

  // load the controller's module
  beforeEach(module('koknusApp'));

  var PreviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PreviewCtrl = $controller('PreviewCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
