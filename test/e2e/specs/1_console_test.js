'use strict';

/*
 * This test file just opens the web app and examine if
 * there is any console errors
 * It marks tests failed if there is any errors in console
 */

describe('Console tests', function() {
  it('should load the app', function() {
    browser.get('/');
    expect(browser.getTitle()).toContain('Swagger Editor');
  });

  it('Should not have any console errors or warnings', function() {
    browser.manage().logs().get('browser').then(function(browserLog) {
      var errorLogs = browserLog.filter(function(log) {
        return log.level.value > 900;
      });
      if (errorLogs.length) {
        console.log('\n\nBrowser console log: \n\n');
        errorLogs.forEach(console.log);
      }
      expect(errorLogs.length).toBe(0);
    });
  });
});
