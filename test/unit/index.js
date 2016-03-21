'use strict';

var angular = require('angular');

describe('Angular', function() {
  it('version', function () {
    expect(angular.version).to.be.a.string;
  });
});