/*  THIS FILE SHOULD BE BROWSER-COMPATIBLE JS!
 *  You can use @REMOVE_LINE_FOR_BROWSER to remove code from the browser build.
 *  Only code on that line will be removed, its mostly to avoid requiring code
 *  that is node specific
 */

var nodeunit = require('../lib/nodeunit'); // @REMOVE_LINE_FOR_BROWSER


exports.testRunModule = function (test) {
    test.expect(59);
    var call_order = [];
    var testmodule = {
        test1: function (test) {
            call_order.push('test1');
            test.ok(true, 'ok true');
            test.done();
        },
        test2: function (test) {
            call_order.push('test2');
            test.ok(false, 'ok false');
            test.ok(false, 'ok false');
            test.done();
        },
        test3: function (test) {
            call_order.push('test3');
            test.done();
        }
    };
    nodeunit.runModule('testmodule', testmodule, {
        log: function (assertion) {
            call_order.push('log');
        },
        testStart: function (name) {
            call_order.push('testStart');
            test.ok(
                name.toString() === 'test1' ||
                name.toString() === 'test2' ||
                name.toString() === 'test3',
                'testStart called with test name '
            );
        },
        testReady: function (tst) {
            call_order.push('testReady');
            test.ok(tst.done, 'testReady called with non-test object');
            test.ok(tst.ok, 'testReady called with non-test object');
            test.ok(tst.same, 'testReady called with non-test object');
            test.ok(tst.expect, 'testReady called with non-test object');
            test.ok(tst._assertion_list, 'testReady called with non-test object');
            test.ok(tst.AssertionError, 'testReady called with non-test object');
            test.ok(tst.fail, 'testReady called with non-test object');
            test.ok(tst.equal, 'testReady called with non-test object');
            test.ok(tst.notEqual, 'testReady called with non-test object');
            test.ok(tst.deepEqual, 'testReady called with non-test object');
            test.ok(tst.notDeepEqual, 'testReady called with non-test object');
            test.ok(tst.strictEqual, 'testReady called with non-test object');
            test.ok(tst.notStrictEqual, 'testReady called with non-test object');
            test.ok(tst.throws, 'testReady called with non-test object');
            test.ok(tst.doesNotThrow, 'testReady called with non-test object');
            test.ok(tst.ifError, 'testReady called with non-test object');
        },
        testDone: function (name, assertions) {
            call_order.push('testDone');
            test.ok(
                name.toString() === 'test1' ||
                name.toString() === 'test2' ||
                name.toString() === 'test3',
                'testDone called with test name'
            );
        },
        moduleDone: function (name, assertions) {
            call_order.push('moduleDone');
            test.equals(assertions.length, 3);
            test.equals(assertions.failures(), 2);
            test.equals(name, 'testmodule');
            test.ok(typeof assertions.duration === "number");
            test.same(call_order, [
                'testStart', 'testReady', 'test1', 'log', 'testDone',
                'testStart', 'testReady', 'test2', 'log', 'log', 'testDone',
                'testStart', 'testReady', 'test3', 'testDone',
                'moduleDone'
            ]);
        }
    }, test.done);
};


exports.testRunModuleTestSpec = function (test) {
    test.expect(22);
    var call_order = [];
    var testmodule = {
        test1: function (test) {
            test.ok(true, 'ok true');
            test.done();
        },
        test2: function (test) {
            call_order.push('test2');
            test.ok(false, 'ok false');
            test.ok(false, 'ok false');
            test.done();
        },
        test3: function (test) {
            test.done();
        }
    };
    nodeunit.runModule('testmodule', testmodule, {
        testspec: "test2",
        log: function (assertion) {
            call_order.push('log');
        },
        testStart: function (name) {
            call_order.push('testStart');
            test.equals(
                name,'test2',
                'testStart called with test name '
            );
        },
        testReady: function (tst) {
            call_order.push('testReady');
            test.ok(tst.done, 'testReady called with non-test object');
            test.ok(tst.ok, 'testReady called with non-test object');
            test.ok(tst.same, 'testReady called with non-test object');
            test.ok(tst.expect, 'testReady called with non-test object');
            test.ok(tst._assertion_list, 'testReady called with non-test object');
            test.ok(tst.AssertionError, 'testReady called with non-test object');
            test.ok(tst.fail, 'testReady called with non-test object');
            test.ok(tst.equal, 'testReady called with non-test object');
            test.ok(tst.notEqual, 'testReady called with non-test object');
            test.ok(tst.deepEqual, 'testReady called with non-test object');
            test.ok(tst.notDeepEqual, 'testReady called with non-test object');
            test.ok(tst.strictEqual, 'testReady called with non-test object');
            test.ok(tst.notStrictEqual, 'testReady called with non-test object');
            test.ok(tst.throws, 'testReady called with non-test object');
            test.ok(tst.doesNotThrow, 'testReady called with non-test object');
            test.ok(tst.ifError, 'testReady called with non-test object');
        },
        testDone: function (name, assertions) {
            call_order.push('testDone');
            test.equal(
                name, 'test2',
                'testDone called with test name'
            );
        },
        moduleDone: function (name, assertions) {
            call_order.push('moduleDone');
            test.equals(assertions.length, 2);
            test.equals(name, 'testmodule');
            test.ok(typeof assertions.duration === "number");
            test.same(call_order, [
                'testStart', 'testReady', 'test2', 'log', 'log', 'testDone',
                'moduleDone'
            ]);
        }
    }, test.done);
};

exports.testRunModuleEmpty = function (test) {
    nodeunit.runModule('module with no exports', {}, {
        log: function (assertion) {
            test.ok(false, 'log should not be called');
        },
        testStart: function (name) {
            test.ok(false, 'testStart should not be called');
        },
        testReady: function (tst) {
            test.ok(false, 'testReady should not be called');
        },
        testDone: function (name, assertions) {
            test.ok(false, 'testDone should not be called');
        },
        moduleDone: function (name, assertions) {
            test.equals(assertions.length, 0);
            test.equals(assertions.failures(), 0);
            test.equals(name, 'module with no exports');
            test.ok(typeof assertions.duration === "number");
        }
    }, test.done);
};


exports.testNestedTests = function (test) {
    var call_order = [];
    var m = {
        test1: function (test) {
            test.done();
        },
        suite: {
            t1: function (test) {
                test.done();
            },
            t2: function (test) {
                test.done();
            },
            another_suite: {
                t3: function (test) {
                    test.done();
                }
            }
        }
    };
    nodeunit.runModule('modulename', m, {
        testStart: function (name) {
            call_order.push(['testStart'].concat(name));
        },
        testReady: function (tst) {
            call_order.push(['testReady']);
        },
        testDone: function (name, assertions) {
            call_order.push(['testDone'].concat(name));
        }
    }, function () {
        test.same(call_order, [
            ['testStart', 'test1'], ['testReady'], ['testDone', 'test1'],
            ['testStart', 'suite', 't1'], ['testReady'], ['testDone', 'suite', 't1'],
            ['testStart', 'suite', 't2'], ['testReady'], ['testDone', 'suite', 't2'],
            ['testStart', 'suite', 'another_suite', 't3'],
            ['testReady'],
            ['testDone', 'suite', 'another_suite', 't3']
        ]);
        test.done();
    });
};
