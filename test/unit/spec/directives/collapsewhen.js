'use strict';

describe('Directive: collapseWhen', function () {

  // load the directive's module
  beforeEach(window.angular.mock.module
('PhonicsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<collapse-when></collapse-when>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the collapseWhen directive');
  }));
});
