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

  describe('#pathForPosition', function () {
    var yaml;
    beforeEach(function () {
      yaml = [
        'swagger: 2',
        'info:',
        '  title: Test document',
        '  version: 0.0.1',
        '  contact:',
        '    name: Mohsen',
        '    url: github.com',
        '    email: me@example.com'
      ].join('\n');

      ASTManager.refresh(yaml);
    });

    it('should return empty array for root elements', function () {
      expect(ASTManager.pathForPosition(0, 0)).to.deep.equal([]);
      expect(ASTManager.pathForPosition(1, 0)).to.deep.equal([]);
    });

  });

});
