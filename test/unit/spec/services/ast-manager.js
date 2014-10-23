'use strict';

describe('Service: ASTManager', function () {

  // load the service's module
  beforeEach(window.angular.mock.module('PhonicsApp'));

  // instantiate service
  var ASTManager;
  beforeEach(inject(function (_ASTManager_) {
    ASTManager = _ASTManager_;
  }));

  it('should do something', function () {
    expect(!!ASTManager).toBe(true);
  });

});
