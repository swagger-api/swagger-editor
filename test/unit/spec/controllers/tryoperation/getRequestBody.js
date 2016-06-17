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

  describe('$scope.getRequestBody', function() {
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

    it('should return null if there is no body-model', function() {
      scope.requestModel = {
        scheme: "http",
        accept: "*/*",
        contentType: "application/json",
        parameters: {
          body: null
        }
      };
      var requestBody = scope.getRequestBody();
      expect(requestBody).to.equal(null);
    });

    it('should return correct body model', function() {
      scope.requestModel = {
        scheme: "http",
        accept: "*/*",
        contentType: "application/json",
        parameters: {
          body: {
            foo: "foo",
            bar: "bar"
          }
        }
      };
      var bodyParam = {foo: "foo", bar: "bar"};
      var requestBody = scope.getRequestBody();
      expect(requestBody).to.equal(JSON.stringify(bodyParam, null, 2));
    });
  });
});
