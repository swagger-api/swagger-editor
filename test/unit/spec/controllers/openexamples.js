'use strict';

var angular = require('angular');

describe('Controller: OpenExamplesCtrl', function() {
  // load the controller's module
  beforeEach(angular.mock.module('SwaggerEditor'));

  var FileLoader;
  var $uibModalInstance;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    // Create a mock object using spies
    var callback = sinon.spy();
    $uibModalInstance = {
      close: callback,
      dismiss: callback,
      result: {
        then: callback
      }
    };

    FileLoader = {
      loadFromUrl: function() {
        return {
          then: function() {}
        };
      }
    };

    $controller('OpenExamplesCtrl', {
      $scope: scope,
      $uibModalInstance: $uibModalInstance,
      FileLoader: FileLoader
    });
  }));

  it('should have a scope', function() {
    expect(Boolean(scope)).to.equal(true);
  });

  it('should select first example as selected file by default', function() {
    expect(scope.selectedFile).to.equal('default.yaml');
  });

  it('honors defaults.examplesFolder configuration when opening files',
    function() {
      sinon.stub(FileLoader, 'loadFromUrl').returns({then: sinon.spy()});

      scope.open('aFile');

      expect(FileLoader.loadFromUrl).to.have.been.calledWithMatch('aFile');
    }
  );
});
