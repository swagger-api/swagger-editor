'use strict';

describe('Controller: OpenExamplesCtrl', function () {

  // load the controller's module
  beforeEach(window.angular.mock.module('SwaggerEditor'));

  var OpenExamplesCtrl,
    FileLoader,
    $modalInstance,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();

    // Create a mock object using spies
    var callback = sinon.spy();
    $modalInstance = {
      close: callback,
      dismiss: callback,
      result: {
        then: callback
      }
    };

    var loadFromUrlCallback = sinon.spy();

    FileLoader = {
      loadFromUrl: function () {
        return {
          then: function () {}
        }
      }
    };

    OpenExamplesCtrl = $controller('OpenExamplesCtrl', {
      $scope: scope,
      $modalInstance: $modalInstance,
      FileLoader: FileLoader
    });
  }));

  it('should have a scope', function () {
    expect(!!scope).to.equal(true);
  });

  it('should select first example as selected file by default', function () {
    expect(scope.selectedFile).to.equal('default.yaml');
  });

  it('honors defaults.examplesFolder configuration when opening files',
    function () {
      sinon.stub(FileLoader, 'loadFromUrl').returns({then: sinon.spy()});

      scope.open('aFile');

      expect(FileLoader.loadFromUrl).to.have.been.calledWithMatch('aFile');
    }
  );
});
