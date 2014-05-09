(function() {
  var CSS, Declaration, Keyframes, Rules;

  Rules = require('./rules');

  Keyframes = require('./keyframes');

  Declaration = require('./declaration');

  CSS = (function() {
    function CSS(stylesheet) {
      this.stylesheet = stylesheet;
    }

    CSS.prototype.eachKeyframes = function(callback) {
      var rule;
      this.number = 0;
      while (this.number < this.stylesheet.rules.length) {
        rule = this.stylesheet.rules[this.number];
        if (rule.keyframes) {
          callback(new Keyframes(this, this.number, rule));
        }
        this.number += 1;
      }
      return false;
    };

    CSS.prototype.containKeyframes = function(rule) {
      return this.stylesheet.rules.some(function(i) {
        return i.keyframes && i.name === rule.name && i.vendor === rule.vendor;
      });
    };

    CSS.prototype.addKeyframes = function(position, rule) {
      if (this.containKeyframes(rule)) {
        return;
      }
      this.stylesheet.rules.splice(position, 0, rule);
      return this.number += 1;
    };

    CSS.prototype.removeKeyframes = function(position) {
      this.stylesheet.rules.splice(position, 1);
      return this.number -= 1;
    };

    CSS.prototype.eachRule = function(callback) {
      return Rules.each(this.stylesheet.rules, callback);
    };

    CSS.prototype.eachDeclaration = function(callback) {
      return this.eachRule(function(rule) {
        return rule.each(callback);
      });
    };

    return CSS;

  })();

  module.exports = CSS;

}).call(this);
