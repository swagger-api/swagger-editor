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

  describe('$scope.hasRequestBody', function() {
    beforeEach(function() {
      var parameters = [
        {
          name: "body",
          in: "body",
          description: "description",
          schema: {
            type: "object",
            properties: {
              foo: {
                type: "string"
              },
              bar: {
                type: "string",
                enum: [
                  "bar",
                  "baz"
                ]
              }
            }
          }
        }
      ];
      scope.specs = {
        swagger: "2.0",
        info: {
          version: "0.0.0",
          title: "Simple API"
        },
        path: {
          "/": {
            get: {
              parameters: parameters,
              responses: {
                200: {
                  description: "OK"
                }
              }
            }
          }
        }
      };
      scope.getParameters = function() {
        return parameters;
      };
      $controller('TryOperation', {
        $scope: scope
      });
    });

    it('should return 1 for one body parameter', function() {
      var hasRequestBody = scope.hasRequestBody();
      expect(hasRequestBody).to.be.equal(1);
    });
  });
});
