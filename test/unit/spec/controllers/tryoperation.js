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

  describe('$scope.generateUrl', function() {
    beforeEach(function() {
      scope.specs = {
        swagger: "2.0",
        info: {
          version: "0.0.0",
          title: "Simple API"
        },
        paths: {
          "/": {
            get: {
              responses: {
                200: {
                  description: "OK"
                }
              }
            }
          }
        }
      };
      scope.operation = {
        responses: {
          200: {
            description: "OK"
          }
        }
      };
      scope.pathName = "/";
    });

    it('is a function', function() {
      expect(scope.generateUrl).to.be.a.function;
    });

    it('returns a basic URL for simple a Swagger operation', function() {
      var url = scope.generateUrl();
      expect(url).to.equal('http://localhost:8080/');
    });
  });

  describe('scope.isJson', function() {
    it('is a function', function() {
      expect(scope.isJson).to.be.a.function;
    });

    it('returns true for objects', function() {
      var obj = {};
      expect(scope.isJson(obj)).to.equal(true);
    });

    it('returns true for arrays', function() {
      var arr = [];
      expect(scope.isJson(arr)).to.equal(true);
    });

    it('returns true for JSON string', function() {
      var obj = "{}";
      var arr = "[]";

      expect(scope.isJson(obj)).to.equal(true);
      expect(scope.isJson(arr)).to.equal(true);
    });

    it('returns false for non-JSON string', function() {
      var str = "string";

      expect(scope.isJson(str)).to.equal(false);
    });
  });
});
