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

  describe('$scope.makeRequestModel', function() {
    describe('Basic Swagger', function() {
      beforeEach(function() {
        scope.specs = {
          swagger: '2.0',
          info: {
            version: '0.0.0',
            title: 'Simple API'
          },
          paths: {
            '/': {
              get: {
                responses: {
                  200: {
                    description: 'OK'
                  }
                }
              }
            }
          }
        };
        scope.operation = {
          parameters: {},
          responses: {
            200: {
              description: 'OK'
            }
          }
        };
        scope.pathName = '/';
      });
    });

    it('should return the model', function() {
      var objModel = {scheme: "http", accept: "*/*"};
      var model = scope.requestModel;
      expect(model).to.deep.equal(objModel);
    });

    it('model should contain parameters', function() {
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
              }
            }
          }
        }
      ];
      scope.getParameters = function() {
        return parameters;
      };
      var objModel = {
        scheme: "http",
        accept: "*/*",
        contentType: "application/json",
        parameters: {
          body: {foo: null}
        }
      };
      var model = scope.requestModel;
      expect(model).to.deep.equal(objModel);
    });
  });
});
