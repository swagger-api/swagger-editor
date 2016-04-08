'use strict';

var angular = require('angular');

describe('Service: Autocomplete', function() {
  // load the service's module
  beforeEach(angular.mock.module('SwaggerEditor'));

  // instantiate service and capture getCompletions method
  var rootScope;
  var getCompletions;
  var editor = {
    completer: {autoSelect: false}
  };
  var session = {};
  var simpleYaml = [
  // 0         1         2        3
  // 012345678901234567890123457890
    'swagger: "2.0"',              // 0
    '',                            // 1
    'info:',                       // 2
    '  ',                          // 3
    '  version: 0.0.0',            // 4
    '  title: Simple API',         // 5
    '  ',                          // 6
    'paths:',                      // 7
    '  ',                          // 8
    '  /:',                        // 9
    '    get:',                    // 10
    '       ',                     // 11
    '      responses:',            // 12
    '        "200":',              // 13
    '          ',                  // 14
    '          description: OK',   // 15
    '          ',                  // 16
    ''                             // 17
  ].join('\n');
  var getValue = function(item) {
    return item.value;
  };

  beforeEach(inject(function($rootScope, _Autocomplete_) {
    rootScope = $rootScope;
    _Autocomplete_.init(editor);
    getCompletions = editor.completers[0].getCompletions;
  }));

  describe('root level suggestions', function() {
    it('suggests root keywords when "s" is typed', function(done) {
      var position = {row: 0, column: 0};
      var prefix = 's';

      rootScope.editorValue = simpleYaml;

      getCompletions(editor, session, position, prefix, function(e, list) {
        var values = list.map(getValue);

        expect(values).to.contain('swagger');
        expect(values).to.contain('info');
        expect(values).to.contain('paths');
        expect(values).not.to.contain('title');
        expect(values).not.to.contain('version');
        done(e);
      });
    });
  });

  describe('second level suggestions', function() {
    it('suggests "contact" if cursor on top of "info" hash', function(done) {
      var prefix = 'c';
      rootScope.editorValue = simpleYaml;

      var position = {row: 3, column: 3};

      getCompletions(editor, session, position, prefix, function(e, list) {
        var values = list.map(getValue);

        try {
          expect(values).to.contain('contact');
        } catch (err) {
          return done(err);
        }

        done(e);
      });
    });

    it('suggests "contact" if cursor in bottom of "info"', function(done) {
      var prefix = 'c';
      rootScope.editorValue = simpleYaml;

      var position = {row: 6, column: 3};

      getCompletions(editor, session, position, prefix, function(e, list) {
        var values = list.map(getValue);

        try {
          expect(values).to.contain('contact');
        } catch (err) {
          return done(err);
        }

        done(e);
      });
    });
  });

  describe('enum suggestions', function() {
    it('suggests "2.0" as a value for "swagger" key', function(done) {
      var position = {row: 0, column: 10};
      var prefix = '"2';

      rootScope.editorValue = 'swagger: 2';

      getCompletions(editor, session, position, prefix, function(e, list) {
        var values = list.map(getValue);

        try {
          expect(values).to.contain('"2.0"');
        } catch (err) {
          return done(err);
        }

        done(e);
      });
    });
  });
});
