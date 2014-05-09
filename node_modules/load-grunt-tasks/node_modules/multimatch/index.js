'use strict';
var minimatch = require('minimatch');
var _ = require('lodash');

function arrayify(arr) {
	return Array.isArray(arr) ? arr : [arr];
}

module.exports = function (list, patterns, options) {
	if (list == null || patterns == null) {
		return [];
	}

	options = options ||{};
	list = arrayify(list);
	patterns = arrayify(patterns);

	return patterns.reduce(function (ret, pattern, i) {
		if (pattern.indexOf('!') === 0) {
			ret = i === 0 ? list : ret;
			return _.difference(ret, minimatch.match(ret, pattern.slice(1), options));
		}

		return _.union(ret, minimatch.match(list, pattern, options));
	}, []);
};
