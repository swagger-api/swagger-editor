'use strict';

describe('TryOperation Controller', function() {
  beforeEach(window.module('SwaggerEditor'));

  var $controller;

  var scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('$scope.generateUrl', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      $scope.operation = {};
      $scope.specs = {};
      $scope.getParameters = function mockGetParameters() {
        return [];
      };
      $scope.$watch = function(){};

      controller = $controller('TryOperation', {$scope: $scope});
    });

    it('is a function', function() {
      expect($scope.generateUrl).to.be.a.function;
    });

    it('returns a basic URL for simple a Swagger operation', function() {
      scope.specs = {
        "swagger": "2.0",
        "info": {
            "version": "0.0.0",
            "title": "Simple API"
        },
        "host": "example.com",
        "paths": {
            "/pets": {
                "get": {
                    "responses": {
                        "200": {
                            "description": "OK"
                        }
                    }
                }
            }
        }
      };
      var url = $scope.generateUrl();
      expect(url).to.equal('http://example.com/pets');
    });
  });
});
