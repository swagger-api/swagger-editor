'use strict';

var angular = require('angular');

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(angular.mock.module('SwaggerEditor'));

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
    expect(!!scope).to.equal(true);

  });
});
