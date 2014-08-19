'use strict';

describe('Service: Backend', function () {

  // load the service's module
  beforeEach(module('phonicsApp'));

  // instantiate service
  var Backend;
  beforeEach(inject(function (_Backend_) {
    Backend = _Backend_;
  }));

  it('should do something', function () {
    expect(!!Backend).toBe(true);
  });

});
