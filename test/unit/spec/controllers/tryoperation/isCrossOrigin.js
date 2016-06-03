'use strict';

describe('Controller: TryOperation', function() {
  beforeEach(window.module('SwaggerEditor'));

  var $controller;
  var scope;

  beforeEach(inject(function(_$controller_, $rootScope) {
    scope = $rootScope.$new();
    $controller = _$controller_;
    scope.operation = {};
    scope.specs = {};
    scope.getParameters = function mockGetParameters() {
      return [];
    };
    scope.$watch = function() {};
    $controller('TryOperation', {
      $scope: scope
    });
  }));

  describe('scope.isCrossOrigin', function() {
    beforeEach(function() {
      scope.locationHost = 'localhost';
    });

    it('is a function', function() {
      expect(scope.isCrossOrigin).to.be.a.function;
    });

    it('returns true if swagger host is not equal to window.location.host',
    function() {
      scope.specs = {host: 'example.com'};
      expect(scope.isCrossOrigin()).to.equal(true);
    });

    it('returns flase if swagger host is equal to window.location.host',
    function() {
      scope.specs = {host: 'localhost'};
      expect(scope.isCrossOrigin()).to.equal(false);
    });
  });
});
