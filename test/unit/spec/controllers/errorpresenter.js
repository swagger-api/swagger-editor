'use strict';

describe('Controller: ErrorPresenterCtrl', function () {

  // load the controller's module
  beforeEach(window.angular.mock.module('SwaggerEditor'));

  var ErrorPresenterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    var rootScope = $rootScope.$new();
    rootScope.warnings = [];
    rootScope.errors = [];

    ErrorPresenterCtrl = $controller('ErrorPresenterCtrl', {
      $scope: scope,
      $rootScope: rootScope
    });
  }));

  it('should have a scope', function () {
    expect(!!scope).to.equal(true);
  });
});
