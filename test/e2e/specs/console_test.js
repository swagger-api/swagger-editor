'use strict';

/*
 * This test file just opens the web app and examine if
 * there is any console errors or warnings.
 * It marks tests failed if there is any errors in console
 */

 describe('Console tests', function () {
  it('should load the app', function () {
    browser.get('/');
    expect(browser.getTitle()).toContain('Swagger Editor');
  });

  it('Should not have any console errors or warnings', function () {
    browser.manage().logs().get('browser').then(function(browserLog) {
      if (browserLog.length) {
        console.log('\n\nBrowser console log: \n\n');
        browserLog.forEach(console.log);
      }
      expect(browserLog.length).toBe(0);
    });
  });
});
