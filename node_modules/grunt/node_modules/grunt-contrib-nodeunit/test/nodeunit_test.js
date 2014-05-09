'use strict';

var grunt = require('grunt');

exports.nodeunit = {
  please_work: function(test) {
    test.expect(1);
    test.ok(true, 'this had better work.');
    test.done();
  },
  fail: function(test) {
    test.expect(3);
    grunt.util.spawn({
      grunt: true,
      args: ['test:fail', '--no-color'],
    }, function(err, result) {
      test.ok(result.stdout.indexOf("Operator:") !== -1, 'Operator should display for multiline.');
      test.ok(result.stdout.indexOf('Message: this value should be truthy') !== -1, 'Message should have been displayed.');
      test.ok(result.stdout.indexOf('Error: undefined == true') !== -1, 'Error should have been displayed.');
      test.done();
    });
  },
};
