'use strict';

describe('Controller: PathpreviewCtrl', function () {

  // load the controller's module
  beforeEach(module('phonicsApp'));

  var PathpreviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PathpreviewCtrl = $controller('PathpreviewCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
