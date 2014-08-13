'use strict';

describe('Controller: OpenexamplesCtrl', function () {

  // load the controller's module
  beforeEach(module('phonicsApp'));

  var OpenexamplesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OpenexamplesCtrl = $controller('OpenexamplesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
