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
    expect(!!ASTManager).to.equal(true);
  });

  it('#pathForPosition', function () {
    var yaml = [
      'swagger: 2'
    ].join('\n');

    ASTManager.refresh(yaml);
    expect(ASTManager.pathForPosition(0, 0)).to.deep.equal([]);

  });

});
