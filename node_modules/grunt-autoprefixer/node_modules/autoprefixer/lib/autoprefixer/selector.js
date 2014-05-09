(function() {
  var Selector, utils;

  utils = require('./utils');

  Selector = (function() {
    Selector.register = function(klass) {
      var name, _i, _len, _ref, _results;
      _ref = klass.names;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        _results.push(this.hacks[name] = klass);
      }
      return _results;
    };

    Selector.hacks = {};

    Selector.load = function(name, prefixes) {
      var klass;
      klass = this.hacks[name];
      if (klass) {
        return new klass(name, prefixes);
      } else {
        return new Selector(name, prefixes);
      }
    };

    function Selector(name, prefixes) {
      this.name = name;
      this.prefixes = prefixes != null ? prefixes : [];
      this.prefixes = this.prefixes.sort(function(a, b) {
        return a.length - b.length;
      });
    }

    Selector.prototype.check = function(selectors) {
      return selectors.indexOf(this.name) !== -1;
    };

    Selector.prototype.prefixed = function(prefix) {
      return this.name.replace(/^([^\w]*)/, '$1' + prefix);
    };

    Selector.prototype.regexp = function() {
      return this.regexpCache || (this.regexpCache = new RegExp(utils.escapeRegexp(this.name), 'gi'));
    };

    Selector.prototype.replace = function(selectors, prefix) {
      return selectors.replace(this.regexp(), this.prefixed(prefix));
    };

    return Selector;

  })();

  module.exports = Selector;

}).call(this);
