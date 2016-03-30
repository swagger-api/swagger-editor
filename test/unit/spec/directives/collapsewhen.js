'use strict';

var angular = require('angular');

describe('Directive: collapseWhen', function() {
  // load the directive's module
  beforeEach(angular.mock.module('SwaggerEditor'));

  var element;
  var scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function($compile) {
    element = angular.element(
      '<div collapse-when>this is the collapseWhen directive</div>');
    element = $compile(element)(scope);
    expect(element.text()).to.equal('this is the collapseWhen directive');
  }));
});
