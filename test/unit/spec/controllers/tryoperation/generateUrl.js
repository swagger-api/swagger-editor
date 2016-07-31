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
    describe('Basic Swagger', function() {
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

      it('returns a basic URL for / path and GET operation', function() {
        var url = scope.generateUrl();
        expect(url).to.equal('http://localhost:8080/');
      });

      it('uses correct scheme when operation has a schema', function() {
        scope.requestModel.scheme = ['https'];
        var url = scope.generateUrl();
        expect(url).to.equal('https://localhost:8080/');
      });

      it('uses correct scheme when spec has a schema in root', function() {
        scope.requestModel.scheme = ['https'];
        var url = scope.generateUrl();
        expect(url).to.equal('https://localhost:8080/');
      });

      it('uses correct host', function() {
        scope.specs.host = 'example.com';
        var url = scope.generateUrl();
        expect(url).to.equal('http://example.com/');
      });

      it('uses correct basePath', function() {
        scope.specs.host = 'example.com';
        scope.specs.basePath = "/v";
        var url = scope.generateUrl();
        expect(url).to.equal('http://example.com/v/');
      });

      describe('query parameters', function() {
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
                  parameters: [
                    {
                      name: "id",
                      in: "query"
                    }
                  ],
                  responses: {
                    200: {
                      description: "OK"
                    }
                  }
                }
              }
            }
          };
        });

        it('uses a number query parameter', function() {
          scope.getParameters = function() {
            var params = [
              {
                name: "id",
                in: "query",
                type: "number"
              }
            ];
            return params;
          };
          $controller('TryOperation', {
            $scope: scope
          });
          scope.requestModel.parameters = {id: 1};
          var url = scope.generateUrl();
          expect(url).to.equal('http://localhost:8080/?id=1');
        });

        it('uses a string query parameter', function() {
          scope.getParameters = function() {
            var params = [
              {
                name: "id",
                in: "query",
                type: "string"
              }
            ];
            return params;
          };
          $controller('TryOperation', {
            $scope: scope
          });
          scope.requestModel = {parameters: {id: "a"}, scheme: ['http']};
          var url = scope.generateUrl();
          expect(url).to.equal('http://localhost:8080/?id=a');
        });

        it('uses a required string query parameter', function() {
          scope.getParameters = function() {
            var params = [
              {
                name: "id",
                in: "query",
                required: true,
                type: "string"
              }
            ];
            return params;
          };
          $controller('TryOperation', {
            $scope: scope
          });
          var url = scope.generateUrl();
          expect(url).to.equal('http://localhost:8080/?id=');
        });

        // Fix the error
        xit('uses a boolean query parameter', function() {
          scope.getParameters = function() {
            var params = [
              {
                name: "id",
                in: "query",
                type: "boolean"
              }
            ];
            return params;
          };
          $controller('TryOperation', {
            $scope: scope
          });
          var url = scope.generateUrl();
          expect(url).to.equal('http://localhost:8080/');
        });

        it('uses a required boolean query parameter', function() {
          scope.getParameters = function() {
            var params = [
              {
                name: "id",
                in: "query",
                required: "true",
                type: "boolean"
              }
            ];
            return params;
          };
          $controller('TryOperation', {
            $scope: scope
          });
          scope.requestModel = {parameters: {id: true}, scheme: 'http'};
          var url = scope.generateUrl();
          expect(url).to.equal('http://localhost:8080/?id=true');
        });

        it('uses multiple query parameters', function() {
          scope.getParameters = function() {
            var params = [
              {
                name: "id",
                in: "query",
                type: "number",
                required: true
              },
              {
                name: "foo",
                in: "query",
                type: "string",
                required: true
              }
            ];
            return params;
          };
          $controller('TryOperation', {
            $scope: scope
          });
          scope.requestModel = {parameters: {foo: 'a', id: 1}, scheme: 'http'};
          var url = scope.generateUrl();
          expect(url).to.equal('http://localhost:8080/?id=1&foo=a');
        });

        it('uses mix of required and non-required query parameters',
        function() {
          scope.getParameters = function() {
            var params = [
              {
                name: "id",
                in: "query",
                type: "number"
              },
              {
                name: "foo",
                in: "query",
                type: "string",
                required: true
              }
            ];
            return params;
          };
          $controller('TryOperation', {
            $scope: scope
          });
          scope.requestModel = {parameters: {id: 1}, scheme: 'http'};
          var url = scope.generateUrl();
          expect(url).to.equal('http://localhost:8080/?id=1&foo=');
        });

        it('should encode special characters in query parameter values',
        function() {
          scope.getParameters = function() {
            var params = [
              {
                name: "id",
                in: "query",
                type: "string",
                required: "true"
              }
            ];
            return params;
          };
          $controller('TryOperation', {
            $scope: scope
          });
          scope.requestModel = {parameters: {id: 'ab#cd'}, scheme: 'http'};
          scope.specs.host = "example.com";
          scope.specs.basePath = "/";
          var url = scope.generateUrl();
          expect(url).to.equal('http://example.com/?id=ab%23cd');
        });
      });

      describe('query parameters collectionFormat', function() {
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
                  parameters: [
                    {
                      name: "id",
                      in: "query",
                      type: "array",
                      items: {
                        type: "integer",
                        enum: [1, 2, 3]
                      }
                    }
                  ],
                  responses: {
                    200: {
                      description: "OK"
                    }
                  }
                }
              }
            }
          };
        });

        it('default (csv)',
        function() {
          scope.getParameters = function() {
            var params = [
              {
                name: "id",
                in: "query",
                type: "array",
                items: {
                  type: "integer",
                  enum: [1, 2, 3]
                }
              }
            ];
            return params;
          };
          $controller('TryOperation', {
            $scope: scope
          });
          scope.requestModel = {parameters: {id: [1, 2, 3]}, scheme: 'http'};
          scope.specs.host = "example.com";
          scope.specs.basePath = "/";
          var url = scope.generateUrl();
          expect(url).to.equal('http://example.com/?id=1,2,3');
        });

        it('csv',
        function() {
          scope.getParameters = function() {
            var params = [
              {
                name: "id",
                in: "query",
                type: "array",
                items: {
                  type: "integer",
                  enum: [1, 2, 3]
                },
                collectionFormat: "csv"
              }
            ];
            return params;
          };
          $controller('TryOperation', {
            $scope: scope
          });
          scope.requestModel = {parameters: {id: [1, 2, 3]}, scheme: 'http'};
          scope.specs.host = "example.com";
          scope.specs.basePath = "/";
          var url = scope.generateUrl();
          expect(url).to.equal('http://example.com/?id=1,2,3');
        });
        it('ssv',
        function() {
          scope.getParameters = function() {
            var params = [
              {
                name: "id",
                in: "query",
                type: "array",
                items: {
                  type: "integer",
                  enum: [1, 2, 3]
                },
                collectionFormat: "ssv"
              }
            ];
            return params;
          };
          $controller('TryOperation', {
            $scope: scope
          });
          scope.requestModel = {parameters: {id: [1, 2, 3]}, scheme: 'http'};
          scope.specs.host = "example.com";
          scope.specs.basePath = "/";
          var url = scope.generateUrl();
          expect(url).to.equal('http://example.com/?id=1%202%203');
        });
        it('tsv',
        function() {
          scope.getParameters = function() {
            var params = [
              {
                name: "id",
                in: "query",
                type: "array",
                items: {
                  type: "integer",
                  enum: [1, 2, 3]
                },
                collectionFormat: "tsv"
              }
            ];
            return params;
          };
          $controller('TryOperation', {
            $scope: scope
          });
          scope.requestModel = {parameters: {id: [1, 2, 3]}, scheme: 'http'};
          scope.specs.host = "example.com";
          scope.specs.basePath = "/";
          var url = scope.generateUrl();
          expect(url).to.equal('http://example.com/?id=1%092%093');
        });
        it('pipes',
        function() {
          scope.getParameters = function() {
            var params = [
              {
                name: "id",
                in: "query",
                type: "array",
                items: {
                  type: "integer",
                  enum: [1, 2, 3]
                },
                collectionFormat: "pipes"
              }
            ];
            return params;
          };
          $controller('TryOperation', {
            $scope: scope
          });
          scope.requestModel = {parameters: {id: [1, 2, 3]}, scheme: 'http'};
          scope.specs.host = "example.com";
          scope.specs.basePath = "/";
          var url = scope.generateUrl();
          expect(url).to.equal('http://example.com/?id=1|2|3');
        });
        it('multi',
        function() {
          scope.getParameters = function() {
            var params = [
              {
                name: "id",
                in: "query",
                type: "array",
                items: {
                  type: "integer",
                  enum: [1, 2, 3]
                },
                collectionFormat: "multi"
              }
            ];
            return params;
          };
          $controller('TryOperation', {
            $scope: scope
          });
          scope.requestModel = {parameters: {id: [1, 2, 3]}, scheme: 'http'};
          scope.specs.host = "example.com";
          scope.specs.basePath = "/";
          var url = scope.generateUrl();
          expect(url).to.equal('http://example.com/?id=1&id=2&id=3');
        });
        it('pipes and csv',
        function() {
          scope.getParameters = function() {
            var params = [
              {
                name: "id",
                in: "query",
                type: "array",
                items: {
                  type: "integer",
                  enum: [1, 2, 3]
                },
                collectionFormat: "pipes"
              },
              {
                name: "name",
                in: "query",
                type: "array",
                items: {
                  type: "string",
                  enum: ["a", "b", "c"]
                },
                collectionFormat: "csv"
              }
            ];
            return params;
          };
          $controller('TryOperation', {
            $scope: scope
          });
          scope.requestModel = {
            parameters: {
              id: [1, 2, 3],
              name: ["a", "b", "c"]
            },
            scheme: 'http'
          };
          scope.specs.host = "example.com";
          scope.specs.basePath = "/";
          var url = scope.generateUrl();
          expect(url).to.equal('http://example.com/?id=1|2|3&name=a,b,c');
        });
      });
    });
  });
});

