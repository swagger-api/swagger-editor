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

  describe('$scope.getHeaders', function() {
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
          responses: {
            200: {
              description: 'OK'
            }
          }
        };
        scope.pathName = '/';
      });
    });

    it('returns header parameters', function() {
      scope.getHeaderParams = {};
      scope.specs.host = '127.0.0.1:8080';
      $controller('TryOperation', {
        $scope: scope
      });

      var params = {
        'Host': '127.0.0.1',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip,deflate,sdch',
        'Accept-Language': 'en-US,en;q=0.8,fa;q=0.6,sv;q=0.4',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Origin': 'http://localhost:8080',
        'Referer': 'http://localhost:8080/context.html',
        'User-Agent': window.navigator.userAgent
      };
      var headerParams = scope.getHeaders();

      expect(headerParams).to.deep.equal(params);
    });
  });
});
