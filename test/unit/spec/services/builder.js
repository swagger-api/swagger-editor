'use strict';

describe('Service: Builder', function () {

  // load the service's module
  beforeEach(window.angular.mock.module('SwaggerEditor'));

  // instantiate service
  var Builder;
  beforeEach(inject(function (_Builder_) {
    Builder = _Builder_;
  }));

  it('should exists', function () {
    expect(!!Builder).to.equal(true);
  });

});
