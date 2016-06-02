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

  describe('scope.isType', function() {
    it('is a function', function() {
      expect(scope.isType).to.be.a.function;
    });

    it('returns false for html type and image Content-Type', function() {
      var header = {"Content-Type": "image/jpeg"};
      var type = "html";

      expect(scope.isType(header, type)).to.equal(false);
    });

    it('returns true for html type and text Content-Type', function() {
      expect(scope.isType({"Content-Type": "text/html"}, "html"))
      .to.equal(true);
    });

    it('returns true for json type and json Content-Type', function() {
      expect(scope.isType({"Content-Type": "application/json"}, "json"))
      .to.equal(true);
    });

    it('returns false for text type and json Content-Type', function() {
      expect(scope.isType({"Content-Type": "application/json"}, "text"))
      .to.equal(false);
    });
  });
});
