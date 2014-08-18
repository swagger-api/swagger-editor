'use strict';

describe('Service: Splitter', function () {

  // load the service's module
  beforeEach(module('koknusApp'));

  // instantiate service
  var Splitter;
  beforeEach(inject(function (_Splitter_) {
    Splitter = _Splitter_;
  }));

  it('should do something', function () {
    expect(!!Splitter).toBe(true);
  });

});
