(function() {
  var OldValue, Value, utils;

  utils = require('./utils');

  OldValue = require('./old-value');

  Value = (function() {
    Value.register = function(klass) {
      var name, _i, _len, _ref, _results;
      _ref = klass.names;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        _results.push(this.hacks[name] = klass);
      }
      return _results;
    };

    Value.hacks = {};

    Value.load = function(name, prefixes) {
      var klass;
      klass = this.hacks[name];
      if (klass) {
        return new klass(name, prefixes);
      } else {
        return new Value(name, prefixes);
      }
    };

    Value.regexps = {};

    Value.regexp = function(name) {
      var _base;
      return (_base = this.regexps)[name] || (_base[name] = utils.regexp(name));
    };

    function Value(name, prefixes) {
      this.name = name;
      this.prefixes = prefixes;
      this.regexp = Value.regexp(this.name);
    }

    Value.prototype.check = function(value) {
      if (value.indexOf(this.name) !== -1) {
        return !!value.match(this.regexp);
      } else {
        return false;
      }
    };

    Value.prototype.old = function(prefix) {
      return new OldValue(prefix + this.name);
    };

    Value.prototype.addPrefix = function(prefix, string) {
      return string.replace(this.regexp, '$1' + prefix + '$2');
    };

    return Value;

  })();

  module.exports = Value;

}).call(this);
