'use strict';

describe('Controller: ErrorpresenterCtrl', function () {

  // load the controller's module
  beforeEach(module('koknusApp'));

  var ErrorpresenterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ErrorpresenterCtrl = $controller('ErrorpresenterCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
