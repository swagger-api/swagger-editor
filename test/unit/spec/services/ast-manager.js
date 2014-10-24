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

    xit('should return parent path for when pointer is at key', function () {
      expect(ASTManager.pathForPosition(2, 0)).to.deep.equal(['info']);
      expect(ASTManager.pathForPosition(2, 4)).to.deep.equal(['info']);
      expect(ASTManager.pathForPosition(2, 9)).to.deep.equal(['info']);
    });

    xit('should return empty path at end of document row 0', function () {
      expect(ASTManager.pathForPosition(7, 0)).to.deep.equal([]);
    });

    xit('should return path to parent when pointer is at end of document ' +
      'with one level of indentation',
      function () {
        expect(ASTManager.pathForPosition(7, 2)).to.deep.equal(['info']);
      }
    );

    xit('should return path to parent when pointer is at end of document ' +
      'with two level of indentation',
      function () {
        expect(ASTManager.pathForPosition(7, 4)).to.deep
        .equal(['info', 'contact']);
      }
    );

    xit('should return full path when pointer is at value',
      function () {
        expect(ASTManager.pathForPosition(2, 11)).to.deep
          .equal(['info', 'title']);
      }
    );
  });

});
