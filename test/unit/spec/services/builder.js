'use strict';

var angular = require('angular');

describe('Service: Builder', function() {
  // load the service's module
  beforeEach(angular.mock.module('SwaggerEditor'));

  // instantiate service
  var Builder;
  beforeEach(inject(function(_Builder_) {
    Builder = _Builder_;
  }));

  it('should exists', function() {
    expect(Boolean(Builder)).to.equal(true);
  });
});
