'use strict';

/*
 * Test navigation behavior
*/

var version = require('../../../package.json').version;

describe('Navigation', function() {
  it('should show the intro', function() {
    expect($('.about-pane').isPresent()).toBe(true);
  });

  it('should be able to dismiss the intro', function() {
    $('#dismis-intro').click();

    expect($('.about-pane').isPresent()).toBe(false);
  });

  it('should open the modal', function() {
    $('.help.dropdown button').click();
    $('.help.dropdown ul li:nth-child(3) a').click();

    expect($('.modal-content').isPresent()).toBe(true);
  });

  it('should show correct version number in the about modal', function() {
    expect($('.modal-body .version-number').getText()).toContain(version);
  });

  it('should close the modal', function() {
    $('.modal-footer .btn').click();

    expect($('.modal-content').isPresent()).toBe(false);
  });
});
