'use strict';

var angular = require('angular');


describe('Controller: EditorCtrl', function () {

  // load the controller's module
  beforeEach(angular.mock.module('SwaggerEditor'));

  var EditorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditorCtrl = $controller('EditorCtrl', {
      $scope: scope
    });
  }));

  it('should have a scope', function () {
    expect(!!scope).to.equal(true);
  });
});
