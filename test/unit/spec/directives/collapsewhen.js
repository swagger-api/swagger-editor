'use strict';

describe('Directive: collapseWhen', function () {

  // load the directive's module
  beforeEach(window.angular.mock.module('SwaggerEditor'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element(
      '<div collapse-when>this is the collapseWhen directive</div>');
    element = $compile(element)(scope);
    expect(element.text()).to.equal('this is the collapseWhen directive');
  }));
});
