'use strict';

/*
 * Test navigation behavior
*/

var version = require('../../../package.json').version;

describe('Navigation', function () {

  it('should show the intro', function () {
    expect($('.about-pane').isPresent()).toBe(true);
  });

  it('should be able to dismiss the intro', function () {
    $('#dismis-intro').click();

    expect($('.about-pane').isPresent()).toBe(false);
  });

  it('should show correct version number in the about modal', function () {
    $('.help.dropdown button').click();
    $('.help.dropdown ul li:nth-child(3) a').click();

    expect($('.modal-body .version-number').getText()).toContain(version);

    $('.modal-footer .btn').click(); // closes the modal for rest of the tests
  });
});
