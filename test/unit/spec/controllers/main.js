'use strict';

var angular = require('angular');

describe('Controller: MainCtrl', function() {
  // load the controller's module
  beforeEach(angular.mock.module('SwaggerEditor'));

  var scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should have a scope', function() {
    expect(Boolean(scope)).to.equal(true);
  });
});
