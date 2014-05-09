'use strict';
var path = require('path');
var os = require('os');
var fs = require('graceful-fs');
var osenv = require('osenv');
var assign = require('object-assign');
var mkdirp = require('mkdirp');
var yaml = require('js-yaml');
var uuid = require('uuid');
var getTempDir = os.tmpdir || os.tmpDir; //support node 0.8

var user = (osenv.user() || uuid.v4()).replace(/\\/g, '');
var tmpDir = path.join(getTempDir(), user);
var configDir = process.env.XDG_CONFIG_HOME || path.join(osenv.home() || tmpDir, '.config');
var permissionError = 'You don\'t have access to this file.';

function Configstore(id, defaults) {
	this.path = path.join(configDir, 'configstore', id + '.yml');
	this.all = [defaults || {}, this.all || {}].reduce(assign, {});
}

Configstore.prototype = Object.create(Object.prototype, {
	all: {
		get: function () {
			try {
				return yaml.safeLoad(fs.readFileSync(this.path, 'utf8'), {
					filename: this.path,
					schema: yaml.JSON_SCHEMA
				});
			} catch (err) {
				// create dir if it doesn't exist
				if (err.code === 'ENOENT') {
					mkdirp.sync(path.dirname(this.path));
					return {};
				}

				// improve the message of permission errors
				if (err.code === 'EACCES') {
					err.message = err.message + '\n' + permissionError + '\n';
				}

				// empty the file if it encounters invalid YAML
				if (err.name === 'YAMLException') {
					fs.writeFileSync(this.path, '');
					return {};
				}

				throw err;
			}
		},
		set: function (val) {
			try {
				// make sure the folder exists, it could have been
				// deleted meanwhile
				mkdirp.sync(path.dirname(this.path));
				fs.writeFileSync(this.path, yaml.safeDump(val, {
					skipInvalid: true,
					schema: yaml.JSON_SCHEMA
				}));
			} catch (err) {
				// improve the message of permission errors
				if (err.code === 'EACCES') {
					err.message = err.message + '\n' + permissionError + '\n';
				}

				throw err;
			}
		}
	},
	size: {
		get: function () {
			return Object.keys(this.all || {}).length;
		}
	}
});

Configstore.prototype.get = function (key) {
	return this.all[key];
};

Configstore.prototype.set = function (key, val) {
	var config = this.all;
	config[key] = val;
	this.all = config;
};

Configstore.prototype.del = function (key) {
	var config = this.all;
	delete config[key];
	this.all = config;
};

module.exports = Configstore;
