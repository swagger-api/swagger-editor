(function() {
  var Declaration, utils;

  utils = require('./utils');

  Declaration = (function() {
    Declaration.register = function(klass) {
      var name, _i, _len, _ref, _results;
      _ref = klass.names;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        _results.push(this.hacks[name] = klass);
      }
      return _results;
    };

    Declaration.hacks = {};

    Declaration.load = function(rule, number, node) {
      var klass, prefix, unprefixed, _ref;
      _ref = this.split(node.property), prefix = _ref[0], unprefixed = _ref[1];
      klass = this.hacks[unprefixed];
      if (klass) {
        return new klass(rule, number, node, prefix, unprefixed);
      } else {
        return new Declaration(rule, number, node, prefix, unprefixed);
      }
    };

    Declaration.split = function(prop) {
      var prefix, separator, unprefixed;
      if (prop[0] === '-') {
        separator = prop.indexOf('-', 1) + 1;
        prefix = prop.slice(0, separator);
        unprefixed = prop.slice(separator);
        return [prefix, unprefixed];
      } else {
        return ['', prop];
      }
    };

    function Declaration(rule, number, node, prefix, unprefixed) {
      this.rule = rule;
      this.number = number;
      this.node = node;
      this.prefix = prefix;
      this.unprefixed = unprefixed;
      this.prop = this.node.property;
      this.value = this.node.value;
      this.valuesCache = {};
    }

    Declaration.prototype.valueContain = function(strings) {
      var _this = this;
      return strings.some(function(i) {
        return _this.value.indexOf(i) !== -1;
      });
    };

    Declaration.prototype.prefixProp = function(prefix, value) {
      if (value == null) {
        value = this.value;
      }
      if (this.rule.contain(prefix + this.unprefixed)) {
        return;
      }
      return this.insertBefore(prefix + this.unprefixed, value);
    };

    Declaration.prototype.insertBefore = function(prop, value) {
      var clone;
      if (this.rule.contain(prop, value)) {
        return;
      }
      clone = utils.clone(this.node, {
        property: prop,
        value: value
      });
      this.rule.add(this.number, clone);
      return this.number += 1;
    };

    Declaration.prototype.remove = function() {
      return this.rule.removeDecl(this.number);
    };

    Declaration.prototype.prefixValue = function(prefix, value) {
      var val;
      val = this.valuesCache[prefix] || this.value;
      return this.valuesCache[prefix] = value.addPrefix(prefix, val);
    };

    Declaration.prototype.setValue = function(value) {
      return this.value = this.node.value = value;
    };

    Declaration.prototype.saveValues = function() {
      var prefix, value, vendor, _ref, _results;
      _ref = this.valuesCache;
      _results = [];
      for (prefix in _ref) {
        value = _ref[prefix];
        vendor = utils.removeNote(prefix);
        if (this.rule.prefix && vendor !== this.rule.prefix) {
          continue;
        }
        if (vendor === this.prefix) {
          _results.push(this.setValue(value));
        } else if (!this.rule.byProp(vendor + this.unprefixed)) {
          _results.push(this.insertBefore(this.prop, value));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Declaration;

  })();

  module.exports = Declaration;

}).call(this);
