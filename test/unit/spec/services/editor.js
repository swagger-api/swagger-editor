'use strict';

var angular = require('angular');

describe('Service: Editor', function() {
  // load the service's module
  beforeEach(angular.mock.module('SwaggerEditor'));

  // instantiate service
  var Editor;
  beforeEach(inject(function(_Editor_) {
    Editor = _Editor_;
  }));

  it('should exists', function() {
    expect(Boolean(Editor)).to.equal(true);
  });
});
