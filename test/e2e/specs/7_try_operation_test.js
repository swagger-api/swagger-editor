'use strict';

describe('Try Operation', function() {
  it('opens "Heroku Pets" example', function() {
    $('#fileMenu').click();
    $('#open-example').click();
    $('.modal-dialog select').click();

    // heroku pets is second one
    $('.modal-dialog select option:nth-child(2)').click();
    $('.modal-dialog .btn.btn-primary').click();

    browser.sleep(300); // wait for modal to go away

    expect($('.modal-dialog').isPresent()).toBe(false);

    browser.wait(function() {
      return $('.info-header').getText().then(function(text) {
        return text.indexOf('PetStore on Heroku') > -1;
      });
    }, 5000);
    expect($('.info-header').getText()).toContain('PetStore on Heroku');
  });

  it('should show no errors', function() {
    expect($('.error-presenter').isPresent()).toBe(false);
  });

  it('opens try this operation for GET /', function() {
    $('ul.paths > li:nth-child(1) li.get.operation .try-operation > button')
      .click();
    expect($('.try-container').isPresent()).toBe(true);
  });

  it('renders the form for "limit" parameter', function() {
    expect(
      $('.try-container input[name="root[parameters][limit]"]').isPresent()
    ).toBe(true);
  });

  it('renders correct request URL', function() {
    expect($('.try-container .raw-request .line.url a').getText())
      .toContain('http://petstore-api.herokuapp.com/pet/?limit=11');
  });

  it('changing the scheme changes the request URL', function() {
    $('.try-container select[name="root[scheme]"]').click();
    $('.try-container select[name="root[scheme]"] option:nth-child(2)').click();

    expect($('.try-container .raw-request .line.url a').getText())
      .toContain('https://petstore-api.herokuapp.com');
  });

  it('updating the limit value updates request URL', function() {
    var limitInput = $('.try-container input[name="root[parameters][limit]"]');

    limitInput.clear();
    limitInput.sendKeys('20');

    // to release focus from the input and trigger the value change
    $('.main-header').click();

    expect($('.try-container .raw-request .line.url a').getText())
      .toContain('limit=20');
  });

  it('sends the request and response appears', function() {
    $('button[ng-click="makeCall()"]').click();

    // wait for the XHR call
    browser.wait(function() {
      return $('.try-container .response-info').isPresent();
    }, 20000); // 20 seconds. it takes a long time for the Heroku app to wake up

    // renders the headers
    expect($('[json="responseHeaders"]').isPresent()).toBe(true);

    // renders the body
    expect($('[json="responseData"]').isPresent()).toBe(true);
  });
});
