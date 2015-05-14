'use strict';

/*
 * Test errors that is being presented to user
*/

function setValue(value) {
  browser.executeScript(function (value) {
    document.querySelector('[ui-ace]').env.editor.setValue(value);
  }, value);
}

describe('Error Presenter', function () {
  it('should show an error when document is empty', function () {
    setValue('');
    browser.wait(function () {
      return $('.error-presenter').isPresent();
    }, 50000);
    expect($('.error-presenter').isPresent()).toBe(true);
  });

  it('should show YAML syntax error with invalid YAML', function () {
    setValue('invalid:1\n  yaml:');
    browser.sleep(1200);
    expect($('.error-presenter').isPresent()).toBe(true);
    expect($('.error-header h4').getText()).toContain('1 Error');
    expect($('.error-presenter .item h5').getText())
      .toContain('YAML Syntax Error');
  });

  it('should show Swagger Syntax Erorr with invalid swagger', function () {
    var val = [
      'swagger: 2.0.0',
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
    browser.sleep(1200);
    expect($('.error-presenter').isPresent()).toBe(true);
    expect($('.error-header h4').getText()).toContain('1 Error');
    expect($('.error-presenter .item h5').getText())
      .toContain('Swagger Error');
  });

  it('should show swagger warning with a document that has warnings',
    function () {
      var val = [
        'swagger: "2.0"',
        'info:',
        '  version: "1.0.0"',
        '  title: Petstore',
        'paths:',
        '  /users:',
        '    post:',
        '      responses:',
        '        200: {}',
        'definitions:',
        '  User: {}'
      ].join('\n');

      setValue(val);
      browser.sleep(1200);
      expect($('.error-presenter').isPresent()).toBe(true);
      expect($('.error-header h4').getText()).toContain('1 Warning');
    }
  );

});
