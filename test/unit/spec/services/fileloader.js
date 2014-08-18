'use strict';

describe('Service: Fileloader', function () {

  // load the service's module
  beforeEach(module('koknusApp'));

  // instantiate service
  var Fileloader;
  beforeEach(inject(function (_Fileloader_) {
    Fileloader = _Fileloader_;
  }));

  it('should do something', function () {
    expect(!!Fileloader).toBe(true);
  });

});
