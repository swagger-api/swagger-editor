'use strict';

var angular = require('angular');

describe('Service: Storage', function() {
  // load the service's module
  beforeEach(angular.mock.module('SwaggerEditor'));

  // instantiate service
  var Storage;
  beforeEach(inject(function(_Storage_) {
    Storage = _Storage_;
  }));

  it('should exists', function() {
    expect(Boolean(Storage)).to.equal(true);
  });
});
