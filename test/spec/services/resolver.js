'use strict';

describe('Service: Resolver', function () {

  // load the service's module
  beforeEach(module('koknusApp'));

  // instantiate service
  var Resolver;
  beforeEach(inject(function (_Resolver_) {
    Resolver = _Resolver_;
  }));

  it('should do something', function () {
    expect(!!Resolver).toBe(true);
  });

});
