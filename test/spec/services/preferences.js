'use strict';

describe('Service: preferences', function () {

  // load the service's module
  beforeEach(module('PhonicsApp'));

  // instantiate service
  var preferences;
  beforeEach(inject(function (_preferences_) {
    preferences = _preferences_;
  }));

  it('should do something', function () {
    expect(!!preferences).toBe(true);
  });

});
