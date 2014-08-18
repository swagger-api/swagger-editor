'use strict';

describe('Service: Storage', function () {

  // load the service's module
  beforeEach(module('koknusApp'));

  // instantiate service
  var Storage;
  beforeEach(inject(function (_Storage_) {
    Storage = _Storage_;
  }));

  it('should do something', function () {
    expect(!!Storage).toBe(true);
  });

});
