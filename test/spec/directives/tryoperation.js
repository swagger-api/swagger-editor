'use strict';

describe('Directive: tryOperation', function () {

  // load the directive's module
  beforeEach(module('koknusApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<try-operation></try-operation>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the tryOperation directive');
  }));
});
