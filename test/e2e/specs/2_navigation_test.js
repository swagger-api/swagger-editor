'use strict';

/*
 * Test navigation behavior
*/

describe('Navigation', function () {
  it('should open in preview mode by default', function () {
    expect(browser.getCurrentUrl()).toNotContain('edit');
  });

  it('should show the intro', function () {
    expect($('.about-pane').isPresent()).toBe(true);
  });

  it('should be able to dismiss the intro', function () {
    $('#dismis-intro').click();
    expect($('.about-pane').isPresent()).toBe(false);
  });

  it('should switch to edit mode when edit button was clicked', function () {
    $('#switch-mode').click();
    $('#edit-mode').click();
    expect(browser.getCurrentUrl()).toContain('edit');
    expect($('.ace_content').isPresent()).toBe(true);
  });
});
