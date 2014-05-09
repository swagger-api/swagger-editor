/*
 * grunt-contrib-nodeunit
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Nodejs libs.
  var path = require('path');
  var util = require('util');

  // External libs.
  var nodeunit = require('nodeunit');

  // ==========================================================================
  // BETTER ERROR DISPLAY
  // ==========================================================================

  // Much nicer error formatting than what comes with nodeunit.
  var betterErrors = function (assertion) {
    var e = assertion.error;
    if (!e || !('actual' in e) || !('expected' in e)) { return assertion; }

    // Temporarily override the global "inspect" property because logging
    // the entire global object is just silly.
    var globalInspect = global.inspect;
    global.inspect = function() { return '[object global]'; };

    e._message = e.message;

    // Pretty-formatted objects.
    var actual = util.inspect(e.actual, false, 10, true);
    var expected = util.inspect(e.expected, false, 10, true);

    var indent = function(str) {
      return (''+str).split('\n').map(function(s) { return '  ' + s; }).join('\n');
    };

    var stack;
    var multiline = (actual + expected).indexOf('\n') !== -1;
    if (multiline) {
      stack = [
        'Actual:', indent(actual),
        'Operator:', indent(e.operator),
        'Expected:', indent(expected),
      ].join('\n');
    } else {
      stack = e.name + ': ' + actual + ' ' + e.operator + ' ' + expected;
    }

    e.stack = stack + '\n' + e.stack.split('\n').slice(1).join('\n');

    // Restore the global "inspect" property.
    global.inspect = globalInspect;
    return assertion;
  };

  // Reformat stack trace to remove nodeunit scripts, fix indentation, etc.
  var cleanStack = function(error) {
    error._stack = error.stack;
    // Show a full stack trace?
    var fullStack = grunt.option('verbose') || grunt.option('stack');
    // Reformat stack trace output.
    error.stack = error.stack.split('\n').map(function(line) {
      if (line[0] === ' ') {
        // Remove nodeunit script srcs from non-verbose stack trace.
        if (!fullStack && line.indexOf(path.join('node_modules', 'nodeunit') + path.sep) !== -1) {
          return '';
        }
        // Remove leading spaces.
        line = line.replace(/^ {4}(?=at)/, '');
        // Remove cwd.
        line = line.replace('(' + process.cwd() + path.sep, '(');
      } else {
        line = line.replace(/Assertion(Error)/, '$1');
      }
      return line + '\n';
    }).join('');

    return error;
  };

  // ==========================================================================
  // CUSTOM NODEUNIT REPORTER
  // ==========================================================================

  // Keep track of the last-started module.
  var currentModule;
  // Keep track of the last-started test(s).
  var unfinished = {};

  // If Nodeunit explodes because a test was missing test.done(), handle it.
  process.on('exit', function() {
    var len = Object.keys(unfinished).length;
    // If there are unfinished tests, tell the user why Nodeunit killed grunt.
    if (len > 0) {
      grunt.log.muted = false;
      grunt.verbose.error().or.writeln('F'.red);
      grunt.log.error('Incomplete tests/setups/teardowns:');
      Object.keys(unfinished).forEach(grunt.log.error, grunt.log);
      grunt.fatal('A test was missing test.done(), so nodeunit exploded. Sorry!',
        Math.min(99, 90 + len));
    }
  });

  // Keep track of failed assertions for pretty-printing.
  var failedAssertions = [];
  function logFailedAssertions() {
    var assertion, stack;
    // Print each assertion error + stack.
    while (assertion = failedAssertions.shift()) {
      betterErrors(assertion);
      cleanStack(assertion.error);
      grunt.verbose.or.error(assertion.testName);
      if (assertion.error.name === 'AssertionError' && assertion.message) {
        grunt.log.error('Message: ' + assertion.message.magenta);
      }
      grunt.log.error(assertion.error.stack).writeln();
    }
  }

  // Define our own Nodeunit reporter.
  nodeunit.reporters.grunt = {
    info: 'Grunt reporter',
    run: function(files, options, callback) {
      var opts = {
        // No idea.
        testspec: undefined,
        // Executed when the first test in a file is run. If no tests exist in
        // the file, this doesn't execute.
        moduleStart: function(name) {
          // Keep track of this so that moduleDone output can be suppressed in
          // cases where a test file contains no tests.
          currentModule = name;
          grunt.verbose.subhead('Testing ' + name).or.write('Testing ' + name);
        },
        // Executed after a file is done being processed. This executes whether
        // tests exist in the file or not.
        moduleDone: function(name) {
          // Abort if no tests actually ran.
          if (name !== currentModule) { return; }
          // Print assertion errors here, if verbose mode is disabled.
          if (!grunt.option('verbose')) {
            if (failedAssertions.length > 0) {
              grunt.log.writeln();
              logFailedAssertions();
            } else {
              grunt.log.ok();
            }
          }
        },
        // Executed before each test is run.
        testStart: function(name) {
          // Keep track of the current test, in case test.done() was omitted
          // and Nodeunit explodes.
          unfinished[name] = name;
          grunt.verbose.write(name + '...');
          // Mute output, in cases where a function being tested logs through
          // grunt (for testing grunt internals).
          grunt.log.muted = true;
        },
        // Executed after each test and all its assertions are run.
        testDone: function(name, assertions) {
          delete unfinished[name];
          // Un-mute output.
          grunt.log.muted = false;
          // Log errors if necessary, otherwise success.
          if (assertions.failures()) {
            assertions.forEach(function(ass) {
              if (ass.failed()) {
                ass.testName = name;
                failedAssertions.push(ass);
              }
            });
            if (grunt.option('verbose')) {
              grunt.log.error();
              logFailedAssertions();
            } else {
              grunt.log.write('F'.red);
            }
          } else {
            grunt.verbose.ok().or.write('.');
          }
        },
        // Executed when everything is all done.
        done: function (assertions) {
          if (assertions.failures()) {
            grunt.warn(assertions.failures() + '/' + assertions.length +
              ' assertions failed (' + assertions.duration + 'ms)');
          } else if (assertions.length === 0) {
            grunt.warn('0/0 assertions ran (' + assertions.duration + 'ms)');
          } else {
            grunt.verbose.writeln();
            grunt.log.ok(assertions.length + ' assertions passed (' +
              assertions.duration + 'ms)');
          }
          // Tell the task manager we're all done.
          callback(); // callback(assertions.failures() === 0);
        }
      };

      // Nodeunit needs absolute paths.
      var paths = files.map(function(filepath) {
        return path.resolve(filepath);
      });
      nodeunit.runFiles(paths, opts);
    }
  };

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('nodeunit', 'Run Nodeunit unit tests.', function() {
    // Run test(s).
    nodeunit.reporters.grunt.run(this.filesSrc, {}, this.async());
  });

};
