'use strict';

describe('Directive: jsonFormatter', function () {

  // load the directive's module
  beforeEach(module('koknusApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<json-formatter></json-formatter>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the jsonFormatter directive');
  }));
});
