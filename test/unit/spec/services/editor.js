'use strict';

describe('Service: Editor', function () {

  // load the service's module
  beforeEach(window.angular.mock.module
('PhonicsApp'));

  // instantiate service
  var Editor;
  beforeEach(inject(function (_Editor_) {
    Editor = _Editor_;
  }));

  it('should do something', function () {
    expect(!!Editor).toBe(true);
  });

});
