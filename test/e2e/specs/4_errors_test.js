'use strict';

/*
 * Test errors that is being presented to user
*/

function setValue (value) {
  browser.executeScript(function (value) {
    document.querySelector('[ui-ace]').env.editor.setValue(value);
  }, value);
}

describe('Errors', function () {

  it('should show no error on empty document', function () {
    setValue('');
    expect($('.error-presenter').isPresent()).toBe(false);
  });

  it('should show YAML syntax error with invalid YAML', function () {
    setValue('invalid:1\n  yaml:');
    browser.sleep(1200);
    expect($('.error-presenter').isPresent()).toBe(true);
    expect($('.error-header h4').getText()).toContain('YAML Syntax');
  });

});
