'use strict';

var angular = require('angular');

describe('Controller: PreviewCtrl', function () {

  // load the controller's module
  beforeEach(angular.mock.module('SwaggerEditor'));

  var PreviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PreviewCtrl = $controller('PreviewCtrl', {
      $scope: scope
    });
  }));

  it('should have a scope', function () {
    expect(!!scope).to.equal(true);

  });
});
