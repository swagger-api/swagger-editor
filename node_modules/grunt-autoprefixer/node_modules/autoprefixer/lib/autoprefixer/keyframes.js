(function() {
  var Keyframes, utils;

  utils = require('./utils');

  Keyframes = (function() {
    function Keyframes(css, number, rule) {
      this.css = css;
      this.number = number;
      this.rule = rule;
      this.prefix = this.rule.vendor;
    }

    Keyframes.prototype.clone = function() {
      return utils.clone(this.rule, {
        keyframes: this.rule.keyframes.map(function(i) {
          if (i.type === 'keyframe') {
            return utils.clone(i, {
              values: i.values.slice(),
              declarations: i.declarations.map(function(decl) {
                return utils.clone(decl);
              })
            });
          } else {
            return utils.clone(i);
          }
        })
      });
    };

    Keyframes.prototype.cloneWithPrefix = function(prefix) {
      var clone;
      clone = this.clone();
      clone.vendor = prefix;
      this.css.addKeyframes(this.number, clone);
      return this.number += 1;
    };

    Keyframes.prototype.remove = function() {
      return this.css.removeKeyframes(this.number);
    };

    return Keyframes;

  })();

  module.exports = Keyframes;

}).call(this);
