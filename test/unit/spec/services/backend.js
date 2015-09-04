'use strict';

describe('Service: Backend', function () {

  // load the service's module
  beforeEach(window.angular.mock.module('SwaggerEditor'));

  // instantiate service
  var Backend;
  beforeEach(inject(function (_Backend_) {
    Backend = _Backend_;
  }));

  it('should exists', function () {
    expect(!!Backend).to.equal(true);
  });

});
