'use strict';

describe('Service: ASTManager', function () {

  // load the service's module
  beforeEach(window.angular.mock.module('PhonicsApp'));

  // instantiate service
  var ASTManager;
  beforeEach(inject(function (_ASTManager_) {
    ASTManager = _ASTManager_;
  }));

  describe('#pathForPosition', function () {
    var yaml;
    beforeEach(function () {
      yaml = [
                 /*
                 0         10        20        30
                 012345678901234567890123456789012345678 */
        /* 0 */ 'swagger: "2.0"',
        /* 1 */ 'info:',
        /* 2 */ '  title: Test document',
        /* 3 */ '  version: 0.0.1',
        /* 4 */ '  contact:',
        /* 5 */ '    name: Mohsen',
        /* 6 */ '    url: github.com',
        /* 7 */ '    email: me@example.com'
      ].join('\n');

      ASTManager.refresh(yaml);
    });

    describe('basics', function () {
      it('should return empty array for root elements', function () {
        expect(ASTManager.pathForPosition(0, 0)).to.deep.equal([]);
        expect(ASTManager.pathForPosition(1, 0)).to.deep.equal([]);
      });

      it('should return path to value when value is selected', function () {
        expect(ASTManager.pathForPosition(0, 11)).to.deep.equal(['swagger']);
      });

      it('should return empty path at end of document row 0', function () {
        expect(ASTManager.pathForPosition(7, 0)).to.deep.equal([]);
      });
      it('should return full path when pointer is at value',
        function () {
          expect(ASTManager.pathForPosition(2, 11)).to.deep
            .equal(['info', 'title']);
        }
      );
    });

    describe('when pointer is at end of document', function () {
      it('with one level of indentation returns path to parent', function () {
          expect(ASTManager.pathForPosition(7, 2)).to.deep.equal(['info']);
      });

      it('with two level of indentation returns path to parent', function () {
        expect(ASTManager.pathForPosition(7, 4)).to.deep
          .equal(['info', 'contact']);
      });
    });

    xdescribe('when pointer is at key with string value', function () {
      it('should return parent path for beginning of line', function () {
        expect(ASTManager.pathForPosition(2, 0)).to.deep.equal(['info']);
      });

      it('should return parent path for beginning of key', function () {
        expect(ASTManager.pathForPosition(2, 4)).to.deep.equal(['info']);

      });

      it('should return parent path for end of key', function () {
        expect(ASTManager.pathForPosition(2, 6)).to.deep.equal(['info']);
      });
    });

    xdescribe('when pointer is at key with hash value', function () {
      it('should return parent path for beginning of line', function () {
        expect(ASTManager.pathForPosition(1, 0)).to.deep.equal(['info']);
      });

      it('should return parent path for beginning of key', function () {
        expect(ASTManager.pathForPosition(1, 0)).to.deep.equal(['info']);

      });

      it('should return parent path for end of key', function () {
        expect(ASTManager.pathForPosition(1, 3)).to.deep.equal(['info']);
      });
    });
  });

});
