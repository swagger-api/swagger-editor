'use strict';

describe('Service: Editor', function () {

  // load the service's module
  beforeEach(window.angular.mock.module('SwaggerEditor'));

  // instantiate service
  var Editor;
  beforeEach(inject(function (_Editor_) {
    Editor = _Editor_;
  }));

  it('should exists', function () {
    expect(!!Editor).to.equal(true);
  });

});
