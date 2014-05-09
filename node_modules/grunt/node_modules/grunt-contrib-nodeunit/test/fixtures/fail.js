'use strict';

exports.fail = {
  fail: function(test) {
    test.ok(undefined, 'this value should be truthy');
    test.done();
  },
  failSupertestError: function(test) {
    var error = new Error('Something arbitrary');
    // Must be long enough that the inspect calls try to
    // wrap the line for indentation.
    error.actual = { foo: 'bar', something: 'complex', more: 'more' };
    error.expected = "No you didn't"
    error.showDiff = true;
    throw(error);
    test.done();
  },
};
