'use strict';

describe('Directive: operationParam', function () {

  // load the directive's module
  beforeEach(module('koknusApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<operation-param></operation-param>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the operationParam directive');
  }));
});
