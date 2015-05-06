'use strict';

describe('Directive: tryOperation', function () {

  // load the directive's module
  beforeEach(window.angular.mock.module('SwaggerEditor'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<try-operation></try-operation>');
    element = $compile(element)(scope);
    expect(element.text()).to.equal('');
  }));
});
