'use strict';

var $ = require('jquery');

describe('Controller: TryOperation', function() {
  beforeEach(window.module('SwaggerEditor'));

  var $controller;
  var scope;

  beforeEach(inject(function(_$controller_, $rootScope) {
    scope = $rootScope.$new();
    $controller = _$controller_;
  }));

  describe('$scope.makeCall', function() {
    it('should call ajax when it\'s called', function() {
      var operation = {
        responses: {
          200: {
            description: 'OK'
          }
        }
      };
      scope.specs = {
        swagger: '2.0',
        info: {
          version: '0.0.0',
          title: 'Simple API'
        },
        paths: {
          '/': {
            get: operation
          }
        }
      };
      scope.pathName = '/';
      scope.operation = operation;
      scope.getParameters = function mockGetParameters() {
        return [];
      };
      scope.$watch = function() {};
      $controller('TryOperation', {
        $scope: scope
      });

      var ajaxStub = sinon.stub($, 'ajax').returns({
        fail: function() {
          return {done: function() {}};
        }
      });

      scope.makeCall();

      ajaxStub.should.have.been.called;
    });
  });
});
