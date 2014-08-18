'use strict';

describe('Service: Validator', function () {

  // load the service's module
  beforeEach(module('koknusApp'));

  // instantiate service
  var Validator;
  beforeEach(inject(function (_Validator_) {
    Validator = _Validator_;
  }));

  it('should do something', function () {
    expect(!!Validator).toBe(true);
  });

});
