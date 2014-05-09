/*!
	object-assign
	ES6 Object.assign() ponyfill
	https://github.com/sindresorhus/object-assign
	by Sindre Sorhus
	MIT License
*/
(function () {
	'use strict';

	var ToObject = function (val) {
		if (val == null) {
			throw new TypeError();
		}

		return Object(val);
	}

	var objectAssign = Object.assign || function (target, source) {
		var pendingException;
		var to = ToObject(target);
		var from = ToObject(source);
		var keys = Object.keys(from);
		var i = keys.length;

		while (i--) {
			try {
				to[keys[i]] = from[keys[i]];
			} catch (err) {
				if (pendingException === undefined) {
					pendingException = err;
				}
			}
		}

		if (pendingException) {
			throw pendingException;
		}

		return to;
	};

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = objectAssign;
	} else {
		window.objectAssign = objectAssign;
	}
})();
