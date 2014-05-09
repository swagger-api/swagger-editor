(function() {
  var Rule, Rules;

  Rule = require('./rule');

  Rules = (function() {
    Rules.each = function(list, callback) {
      var rules;
      rules = new Rules(list);
      return rules.each(callback);
    };

    function Rules(list) {
      this.list = list;
    }

    Rules.prototype.each = function(callback) {
      var i, keyframe, rule, _i, _len, _ref;
      this.number = 0;
      while (this.number < this.list.length) {
        i = this.list[this.number];
        if (i.rules) {
          Rules.each(i.rules, callback);
        }
        if (i.keyframes) {
          _ref = i.keyframes;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            keyframe = _ref[_i];
            if (keyframe.type === 'keyframe') {
              rule = new Rule(this, this.number, keyframe, i.vendor);
              callback(rule);
            }
          }
        }
        if (i.declarations) {
          rule = new Rule(this, this.number, i, i.vendor);
          callback(rule);
        }
        this.number += 1;
      }
      return false;
    };

    Rules.prototype.contain = function(selector) {
      var i, _i, _len, _ref;
      _ref = this.list;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        if (!i.selectors) {
          continue;
        }
        if (i.selectors.join(', ') === selector) {
          return true;
        }
      }
      return false;
    };

    Rules.prototype.add = function(position, rule) {
      this.list.splice(position, 0, rule);
      return this.number += 1;
    };

    Rules.prototype.remove = function(position) {
      this.list.splice(position, 1);
      return this.number -= 1;
    };

    return Rules;

  })();

  module.exports = Rules;

}).call(this);
