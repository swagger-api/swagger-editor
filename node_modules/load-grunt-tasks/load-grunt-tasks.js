'use strict';
var path = require('path');
var findup = require('findup-sync');
var multimatch = require('multimatch');

function arrayify(el) {
	return Array.isArray(el) ? el : [el];
}

module.exports = function (grunt, options) {
	options = options || {};

	var pattern = arrayify(options.pattern || ['grunt-*']);
	var config = options.config || findup('package.json');
	var scope = arrayify(options.scope || ['dependencies', 'devDependencies', 'peerDependencies']);

	if (typeof config === 'string') {
		config = require(path.resolve(config));
	}

	pattern.push('!grunt', '!grunt-cli');

	var names = scope.reduce(function (result, prop) {
		return result.concat(Object.keys(config[prop] || {}));
	}, []);

	multimatch(names, pattern).forEach(grunt.loadNpmTasks);
};
