'use strict';

var angular = require('angular');

describe('Service: FileLoader', function() {
  // load the service's module
  beforeEach(angular.mock.module('SwaggerEditor'));

  // instantiate service
  var FileLoader;
  beforeEach(inject(function(_FileLoader_) {
    FileLoader = _FileLoader_;
  }));

  it('should exists', function() {
    expect(Boolean(FileLoader)).to.equal(true);
  });
});
