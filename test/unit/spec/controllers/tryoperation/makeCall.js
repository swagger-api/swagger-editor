'use strict';

var $ = require('jquery');

describe('Controller: TryOperation', function() {
  beforeEach(window.module('SwaggerEditor'));

  var $controller;
  var scope;

  beforeEach(inject(function(_$controller_, $rootScope) {
    scope = $rootScope.$new();
    $controller = _$controller_;
    scope.operation = {};
    scope.specs = {};
  }));

  describe('$scope.makeCall', function() {
    afterEach(function() {
      $.ajax.restore();
    });

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
      scope.getParameters = function mockGetParameters() {
        return [];
      };
      scope.pathName = '/';
      scope.operation = operation;

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

    describe('use server', function() {

      it('should upload the file', function() {
        var parameters = [{
          name: 'upload',
          in: 'formData',
          required: true,
          type: 'file'
        }];
        scope.specs = {
          host: 'localhost:3000',
          swagger: '2.0',
          info: {
            version: '0.0.0',
            title: 'Upload API'
          },
          security: [],
          consumes: ['multipart/form-data'],
          paths: {
            '/': {
              post: {
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
        scope.operationName = 'post';
        scope.pathName = '/upload';

        scope.getParameters = function() {
          return [{
            name: 'upload',
            in: 'formData',
            required: true,
            type: 'file',
            schema: {
              type: 'file'
            }
          }];
        };
        scope.$watch = function() {};
        $controller('TryOperation', {
          $scope: scope
        });
        scope.getHeaderParams = {};
        scope.specs.host = 'localhost:3000';
        sinon.stub(scope, 'getHeaders').returns({
          'Accept': "*/*",
          'Content-Type': 'multipart/form-data'
        });
        sinon.stub(scope, 'getRequestBody').returns({mydata: 12});

        sinon.stub($, "ajax").returns({
          fail: function() {
            return {done: function() {}};
          }
        });

        scope.makeCall();

        $.ajax.should.have.been.calledWithMatch({
          url: 'http://localhost:3000/upload',
          type: 'post',
          headers: {
            'Accept': '*/*',
            'Content-Type': undefined
          },
          data: {mydata: 12},
          processData: false
        });
      });
    });

  });
});
