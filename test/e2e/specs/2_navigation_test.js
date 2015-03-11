'use strict';

/*
 * Test navigation behavior
*/

describe('Navigation', function () {

  it('should show the intro', function () {
    expect($('.about-pane').isPresent()).toBe(true);
  });

  it('should be able to dismiss the intro', function () {
    $('#dismis-intro').click();
    expect($('.about-pane').isPresent()).toBe(false);
  });
});
