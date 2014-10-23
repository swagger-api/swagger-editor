'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(window.angular.mock.module('PhonicsApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should have a scope', function () {
    expect(!!scope).toBe(true);

  });
});
