'use strict';

var angular = require('angular');

describe('Directive: schemaModel', function() {
  // load the directive's module
  beforeEach(angular.mock.module('SwaggerEditor'));

  var element;
  var scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should render', inject(function($compile) {
    scope.stringSchema = {type: 'string'};
    element = angular.element(
      '<schema-model schema="stringSchema"></schema-model>'
    );
    element = $compile(element)(scope);
    expect(element.text()).to.contain('⇄');
  }));
});
