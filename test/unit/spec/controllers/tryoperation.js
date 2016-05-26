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

      xit('uses a number query parameter', function() {
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
                    type: "number"
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
        scope.requestModel = {parameters: {id: 1}, scheme: ['http']};
        var url = scope.generateUrl();
        expect(url).to.equal('http://localhost:8080/?id=1');
      });

      xit('uses a string query parameter', function() {
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
                    type: "string"
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
        scope.requestModel = {parameters: {id: "a"}, scheme: ['http']};
        var url = scope.generateUrl();
        expect(url).to.equal('http://localhost:8080/?id=a');
      });

      xit('uses a required string query parameter', function() {
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
                    type: "string",
                    required: true
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
        // scope.requestModel = {parameters: {id: "a"}, scheme: ['http']};
        var url = scope.generateUrl();
        expect(url).to.equal('http://localhost:8080/?id=');
      });

      xit('uses a boolean query parameter', function() {
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
                    type: "boolean",
                    required: "false"
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
        // scope.requestModel = {parameters: {id: false}, scheme: 'http'};
        var url = scope.generateUrl();
        expect(url).to.equal('http://localhost:8080/');
      });

      xit('uses a required boolean query parameter', function() {
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
                    type: "boolean",
                    required: "true"
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
        scope.requestModel = {parameters: {id: true}, scheme: 'http'};
        var url = scope.generateUrl();
        expect(url).to.equal('http://localhost:8080/?id=true');

        scope.requestModel = {parameters: {id: false}, scheme: 'http'};
        expect(url).to.equal('http://localhost:8080/?id=false'); // ???
      });

      xit('uses multiple query parameters', function() {
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
                    type: "number",
                    required: true
                  },
                  {
                    name: "foo",
                    in: "query",
                    type: "string",
                    required: "true"
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
        scope.requestModel = {parameters: {foo: 'a', id: 1}, scheme: 'http'};
        var url = scope.generateUrl();
        expect(url).to.equal('http://localhost:8080/?id=1&foo=a');
      });

      xit('uses mix of required and non-required query parameters', function() {
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
                    type: "number"
                  },
                  {
                    name: "foo",
                    in: "query",
                    type: "string",
                    required: "true"
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
        // scope.requestModel = {parameters: {foo: 'a', id: 1}, scheme: 'http'};
        var url = scope.generateUrl();
        expect(url).to.equal('http://localhost:8080/?foo=');
      });
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

  xdescribe('scope.isCrossOrigin', function() {
    beforeEach(function() {
      scope.locationHost = 'localhost';
    });

    it('is a function', function() {
      expect(scope.isCrossOrigin).to.be.a.function;
    });

    it('returns true if swagger host is equal to window.location.host',
    function() {
      scope.specs = {host: 'localhost'};
      expect(scope.isCrossOrigin()).to.equal(true);
    });

    it('returns true if swagger host is equal to window.location.host',
    function() {
      scope.specs = {host: 'example.com'};
      expect(scope.isCrossOrigin()).to.equal(false);
    });
  });

  describe('$scope.getRequestBody', function() {

  });
});
