var exec = require('child_process').exec,
    path = require('path');

var bin = path.resolve(__dirname, '../bin/nodeunit');
var testfile_fullpath = path.resolve(__dirname, './fixtures/example_test.js');

exports['run test suite using absolute path'] = function (test) {
    exec(bin + ' ' + testfile_fullpath, function (err, stdout, stderr) {
        if (err) {
            return test.done(err);
        }
        test.ok(/example test/.test(stdout));
        test.ok(/1 assertion/.test(stdout));
        test.done();
    });
};
