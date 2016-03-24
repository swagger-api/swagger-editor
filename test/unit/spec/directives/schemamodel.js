'use strict';

var angular = require('angular');

describe('Directive: schemaModel', function () {

  // load the directive's module
  beforeEach(angular.mock.module('SwaggerEditor'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<schema-model></schema-model>');
    element = $compile(element)(scope);
    expect(element.text()).to.equal('');
  }));
});
