'use strict';

describe('Service: Storage', function () {

  // load the service's module
  beforeEach(window.angular.mock.module('SwaggerEditor'));

  // instantiate service
  var Storage;
  beforeEach(inject(function (_Storage_) {
    Storage = _Storage_;
  }));

  it('should exists', function () {
    expect(!!Storage).to.equal(true);
  });

});
