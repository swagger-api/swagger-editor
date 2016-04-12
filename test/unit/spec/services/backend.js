'use strict';

var angular = require('angular');

describe('Service: Backend', function() {
  // load the service's module
  beforeEach(angular.mock.module('SwaggerEditor'));

  // instantiate service
  var Backend;
  beforeEach(inject(function(_Backend_) {
    Backend = _Backend_;
  }));

  it('should exists', function() {
    expect(Boolean(Backend)).to.equal(true);
  });
});
