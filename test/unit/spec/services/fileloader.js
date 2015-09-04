'use strict';

describe('Service: FileLoader', function () {

  // load the service's module
  beforeEach(window.angular.mock.module('SwaggerEditor'));

  // instantiate service
  var FileLoader;
  beforeEach(inject(function (_FileLoader_) {
    FileLoader = _FileLoader_;
  }));

  it('should exists', function () {
    expect(!!FileLoader).to.equal(true);
  });

});
