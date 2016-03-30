'use strict';

var angular = require('angular');

describe('Directive: tryOperation', function() {
  // load the directive's module
  beforeEach(angular.mock.module('SwaggerEditor'));

  var element;
  var scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function($compile) {
    element = angular.element('<try-operation></try-operation>');
    element = $compile(element)(scope);
    expect(element.text()).to.equal('');
  }));
});
