(function() {
  var Processor, utils;

  utils = require('./utils');

  Processor = (function() {
    function Processor(prefixes) {
      this.prefixes = prefixes;
    }

    Processor.prototype.add = function(css) {
      var selector, _i, _len, _ref,
        _this = this;
      css.eachKeyframes(function(keyframes) {
        if (keyframes.prefix) {
          return;
        }
        return _this.prefixes.each('@keyframes', function(prefix) {
          return keyframes.cloneWithPrefix(prefix);
        });
      });
      _ref = this.prefixes.add.selectors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selector = _ref[_i];
        css.eachRule(function(rule) {
          if (!rule.selectors) {
            return;
          }
          if (selector.check(rule.selectors)) {
            return rule.prefixSelector(selector);
          }
        });
      }
      css.eachDeclaration(function(decl, vendor) {
        if (_this.prefixes.isCustom(vendor)) {
          vendor = null;
        }
        return _this.prefixes.each(decl.prop, function(prefix) {
          if (vendor && vendor !== utils.removeNote(prefix)) {
            return;
          }
          if (decl.valueContain(_this.prefixes.other(prefix))) {
            return;
          }
          return decl.prefixProp(prefix);
        });
      });
      return css.eachDeclaration(function(decl, vendor) {
        var prefix, value, _j, _k, _len1, _len2, _ref1, _ref2;
        if (_this.prefixes.isCustom(vendor)) {
          vendor = null;
        }
        _ref1 = _this.prefixes.values('add', decl.unprefixed);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          value = _ref1[_j];
          if (!value.check(decl.value)) {
            continue;
          }
          _ref2 = value.prefixes;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            prefix = _ref2[_k];
            if (vendor && vendor !== utils.removeNote(prefix)) {
              continue;
            }
            decl.prefixValue(prefix, value);
          }
        }
        return decl.saveValues();
      });
    };

    Processor.prototype.remove = function(css) {
      var selector, _i, _len, _ref,
        _this = this;
      css.eachKeyframes(function(keyframes) {
        if (_this.prefixes.toRemove(keyframes.prefix + '@keyframes')) {
          return keyframes.remove();
        }
      });
      _ref = this.prefixes.remove.selectors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selector = _ref[_i];
        css.eachRule(function(rule) {
          if (!rule.selectors) {
            return;
          }
          if (rule.selectors.indexOf(selector) !== -1) {
            return rule.remove();
          }
        });
      }
      return css.eachDeclaration(function(decl, vendor) {
        var checker, _j, _len1, _ref1;
        if (_this.prefixes.toRemove(decl.prop)) {
          if (decl.rule.byProp(decl.unprefixed)) {
            decl.remove();
            return;
          }
        }
        _ref1 = _this.prefixes.values('remove', decl.unprefixed);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          checker = _ref1[_j];
          if (checker.check(decl.value)) {
            decl.remove();
            return;
          }
        }
      });
    };

    return Processor;

  })();

  module.exports = Processor;

}).call(this);
