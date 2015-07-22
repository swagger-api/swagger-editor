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
    describe('out of range', function (done) {
      it('returns empty array for out of range row', function (done) {
        var position = {line: 3, column: 0};

        ASTManager.pathForPosition('swagger: 2.0', position, function (path) {
          expect(path).to.deep.equal([]);
          done();
        });
      });

      it('returns empty array for out of range column', function (done) {
        var position = {line: 0, column: 100};

        ASTManager.pathForPosition('swagger: 2.0', position, function (path) {
          expect(path).to.deep.equal([]);
          done();
        });
      });
    });

    describe('when document is a simple hash `swagger: 2.0`', function () {
      beforeEach(function () {
        //    //0         0
        //    //012345678910
        yaml = 'swagger: 2.0';
      });

      // TODO: test edges

      it('should return empty array when pointer is at middle of the hash key',
        function (done) {
          var position = {line: 0, column: 3};
          ASTManager.pathForPosition(yaml, position, function (path) {
            expect(path).to.deep.equal([]);
            done();
          });
        }
      );

      it('should return ["swagger"] when pointer is at the value',
        function (done) {
          var position = {line: 0, column: 10};
          ASTManager.pathForPosition(yaml, position, function (path) {
            expect(path).to.deep.equal(['swagger']);
            done();
          });
        }
      );
    });

    describe('when document is an array: ["abc", "cde"]', function () {
      beforeEach(function () {
        yaml = [
                   /*
                   0
                   01234567 */
          /* 0 */ '- abc',
          /* 1 */ '- def'
        ].join('\n');
      });

      it('should return empty array when pointer is at array dashs',
        function (done) {
          var position = {line: 0, column: 0};
          ASTManager.pathForPosition(yaml, position, function (path) {
            expect(path).to.deep.equal([]);
            done();
          });
        }
      );

      it('should return ["0"] when pointer is at abc',
        function (done) {
          var position = {line: 0, column: 3};
          ASTManager.pathForPosition(yaml, position, function (path) {
            expect(path).to.deep.equal(['0']);
            done();
          });
        }
      );

      it('should return ["1"] when pointer is at def',
        function (done) {
          var position = {line: 1, column: 3};
          ASTManager.pathForPosition(yaml, position, function (path) {
            expect(path).to.deep.equal(['1']);
            done();
          });
        }
      );
    });

    describe('when document is an array of arrays', function () {
      beforeEach(function () {
        yaml = [
                   /*
                   0         10
                   0123456789012345 */
          /* 0 */ '-',
          /* 1 */ ' - abc',
          /* 2 */ ' - def',
          /* 3 */ '-',
          /* 4 */ ' - ABC',
          /* 5 */ ' - DEF'
        ].join('\n');
      });

      it('should return empty array when pointer is at array dashs',
        function (done) {
          var position = {line: 0, column: 0};
          ASTManager.pathForPosition(yaml, position, function (path) {
            expect(path).to.deep.equal([]);
            done();
          });
        }
      );

      it('should return ["0", "0"] when pointer is at "abc"',
        function (done) {
          var position = {line: 1, column: 5};
          ASTManager.pathForPosition(yaml, position, function (path) {
            expect(path).to.deep.equal(['0', '0']);
            done();
          });
        }
      );
    });

    describe('when document is an array of hashs', function () {
      beforeEach(function () {
        yaml = [
                   /*
                   0         10
                   0123456789012345 */
          /* 0 */ '- key: value',
          /* 1 */ '  num: 1',
          /* 2 */ '- name: Tesla',
          /* 3 */ '  year: 2015'
        ].join('\n');
      });

      it('should return empty array when pointer is at array dashs',
        function (done) {
          var position = {line: 0, column: 0};
          ASTManager.pathForPosition(yaml, position, function (path) {
            expect(path).to.deep.equal([]);
            done();
          });
        }
      );

      it('should return ["0"] when pointer is at "key"',
        function (done) {
          var position = {line: 0, column: 3};
          ASTManager.pathForPosition(yaml, position, function (path) {
            expect(path).to.deep.equal(['0']);
            done();
          });
        }
      );

      it('should return ["0", "key"] when pointer is at "value"',
        function (done) {
          var position = {line: 0, column: 9};
          ASTManager.pathForPosition(yaml, position, function (path) {
            expect(path).to.deep.equal(['0', 'key']);
            done();
          });
        }
      );

      it('should return ["1", "year"] when pointer is at "2015"',
        function (done) {
          var position = {line: 3, column: 10};
          ASTManager.pathForPosition(yaml, position, function (path) {
            expect(path).to.deep.equal(['1', 'year']);
            done();
          });
        }
      );
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
      });

      it('should return empty array for root elements', function (done) {
        var position = {line: 0, column: 0};
        ASTManager.pathForPosition(yaml, position, function (path) {
          expect(path).to.deep.equal([]);
          done();
        });
      });

      it('should return ["info", "contact", "email"] when pointer is at me@',
        function (done) {
          var position = {line: 7, column: 13};
          ASTManager.pathForPosition(yaml, position, function (path) {
            expect(path).to.deep.equal(['info', 'contact', 'email']);
            done();
          });
        }
      );
    });
  });
});
