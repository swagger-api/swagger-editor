'use strict';

describe('Service: ASTManager', function () {

  // load the service's module
  beforeEach(window.angular.mock.module('SwaggerEditor'));

  // instantiate service
  var ASTManager;
  beforeEach(inject(function (_ASTManager_) {
    ASTManager = _ASTManager_;
  }));

  describe('#pathForPosition', function () {
    var yaml;

    describe('when document is only a key', function () {
      beforeEach(function () {
        //    //012345678
        yaml = 'swagger: ';
        ASTManager.refresh(yaml);
      });

      describe('when pointer is at end of document', function () {
        it('should return the single key in path', function () {
          expect(ASTManager.pathForPosition(0, 8)).to.deep.equal(['swagger']);
        });
      });
    });

    describe('when document is only a key value map', function () {
      beforeEach(function () {
        //    //0123456789
        yaml = 'swagger: 2'
        ASTManager.refresh(yaml);
      });

      describe('when pointer is at end of document', function () {
        it('should return the single key in path', function () {
          expect(ASTManager.pathForPosition(0, 9)).to.deep.equal(['swagger']);
        });
      });
    });

    describe('full document', function () {
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
          /* 7 */ '    email: me@example.com',
          /* 8 */ '                         '
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

        it('should return full path when pointer is at value', function () {
          expect(ASTManager.pathForPosition(2, 11)).to.deep
            .equal(['info', 'title']);
        });
      });

      describe('when pointer is at end of document', function () {
        it('with 1 level of indentation returns path to parent', function () {
          expect(ASTManager.pathForPosition(8, 2)).to.deep.equal(['info']);
        });

        it('with 2 level of indentation returns path to parent', function () {
          expect(ASTManager.pathForPosition(8, 4)).to.deep
            .equal(['info', 'contact']);
        });

        it('with 3 level of indentation return path to parent', function () {
          expect(ASTManager.pathForPosition(8, 6)).to.deep
            .equal(['info', 'contact', 'email']);
        });

        it('with 4 level of indentation does the same as 3 level', function () {
          expect(ASTManager.pathForPosition(8, 8)).to.deep
            .equal(['info', 'contact', 'email']);
        });
      });

      describe('when pointer is at key with single line value', function () {
        it('should return parent path for beginning of line', function () {
          expect(ASTManager.pathForPosition(2, 0)).to.deep.equal([]);
        });

        it('should return parent path for beginning of key', function () {
          expect(ASTManager.pathForPosition(2, 4)).to.deep.equal(['info']);
        });

        it('should return parent path for middle of key', function () {
          expect(ASTManager.pathForPosition(2, 5)).to.deep.equal(['info']);
        });

        it('should return parent path for end of key', function () {
          expect(ASTManager.pathForPosition(2, 7)).to.deep.equal(['info']);
        });
      });

      describe('when pointer is at key with multi-line value', function () {
        it('should return parent path for beginning of line', function () {
          expect(ASTManager.pathForPosition(1, 0)).to.deep.equal([]);
        });

        it('should return parent path for middle of key', function () {
          expect(ASTManager.pathForPosition(2, 5)).to.deep.equal(['info']);
        });

        it('should return parent path for middle of a deep key', function () {
          expect(ASTManager.pathForPosition(5, 7))
            .to.deep.equal(['info', 'contact']);
        });
      });
    });
  });
});
