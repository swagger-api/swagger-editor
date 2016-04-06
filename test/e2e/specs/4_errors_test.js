'use strict';

/*
 * Test errors that is being presented to user
*/

var setValue = function(value) {
  browser.executeScript(function(value) {
    document.querySelector('[ui-ace]').env.editor.setValue(value);
  }, value);
  browser.sleep(500);
};

describe('Error Presenter', function() {
  it('should show an error when document is empty', function() {
    setValue('');
    expect($('.error-presenter').isPresent()).toBe(true);
  });

  it('should show YAML syntax error with invalid YAML', function() {
    setValue('invalid:1\n  yaml:');

    expect($('.error-presenter').isPresent()).toBe(true);
    expect($('.error-header h4').getText()).toContain('Error');
    expect($('.error-presenter .item h5.error').getText())
      .toContain('YAML Syntax Error');
  });

  it('should show Swagger Error with invalid swagger', function() {
    var val = [
      'swagger: "2.0"',
      'info:',
      '  version: "1.0.0"',
      '  title: Petstore',
      'paths:',
      '  /users:',
      '    post:',
      '      responses:',
      '        200: {}'
    ].join('\n');

    setValue(val);

    expect($('.error-presenter').isPresent()).toBe(true);
    expect($('.error-header h4').getText()).toContain('Error');
    expect($('.error-presenter .item h5.error').getText())
      .toContain('Swagger Error');
  });

  it('should show swagger warning with a document that has warnings',
    function() {
      var val = [
        'swagger: "2.0"',
        'info:',
        '  version: "1.0.0"',
        '  title: Petstore',
        'paths:',
        '  /users:',
        '    post:',
        '      responses:',
        '        200:',
        '          description: OK',
        'definitions:',
        '  User: {}'
      ].join('\n');

      setValue(val);

      expect($('.error-presenter').isPresent()).toBe(true);
      expect($('.error-header h4').getText()).toContain('Warning');
    }
  );
});
