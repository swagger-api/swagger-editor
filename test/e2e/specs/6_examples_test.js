'use strict';

describe('Example', function() {
  [
    'Uber API',
    'PetStore on Heroku',
    'Simple API',
    'Echo',
    'Swagger Petstore (Simple)',
    'Swagger Petstore',
    'Basic Auth Example',
    'Swagger Sample API'
  ].forEach(testExample);
});

/**
 * @param {string} title - title
 * @param {int} index - index
*/
function testExample(title, index) {
  describe(title, function() {
    it('should open ' + title, function() {
      $('#fileMenu').click();
      $('#open-example').click();

      // sleep for modal to finish animation. Protractor should do this, but for
      // now it's not doing it so we put this sleep here
      browser.sleep(100);
      $('.modal-dialog select').click();
      $('.modal-dialog select option:nth-child(' + (index + 1) + ')').click();
      $('.modal-dialog .btn.btn-primary').click();

      browser.wait(function() {
        return $('.modal-dialog').isPresent().then(function(isPresent) {
          return !isPresent;
        });
      }, 5000);

      expect($('.modal-dialog').isPresent()).toBe(false);
    });

    it('should show the info box for ' + title, function() {
      expect($('.info-header').getText()).toContain(title);
    });

    it('should show no errors for ' + title, function() {
      expect($('.error-presenter').isPresent()).toBe(false);
    });
  });
}
