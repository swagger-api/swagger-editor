'use strict';

describe('Example', function () {
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

function testExample(title, index) {
  describe(title, function () {
    it('should open example', function () {
      $('#fileMenu').click();
      $('#open-example').click();

      // sleep for modal to finish animation. Protractor should do this, but for
      // now it's not doing it so we put this sleep here
      browser.sleep(100);
      $('.modal-dialog select').click();
      $('.modal-dialog select option:nth-child(' + (index + 1) + ')').click();
      $('.modal-dialog .btn.btn-primary').click();

      expect($('.modal-dialog').isPresent()).toBe(false);
      expect($('.info-header').getText()).toContain(title);
    });

    it('should show no errors', function () {
      expect($('.error-presenter').isPresent()).toBe(false);
    });
  });
}
