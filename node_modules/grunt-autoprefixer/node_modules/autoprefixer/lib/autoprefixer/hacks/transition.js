(function() {
  var Declaration, Transition, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Declaration = require('../declaration');

  Transition = (function(_super) {
    __extends(Transition, _super);

    function Transition() {
      _ref = Transition.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Transition.names = ['transition', 'transition-property'];

    Transition.prototype.prefixValue = function(prefix, value) {
      if (prefix === '-ms-' && value.name === 'transform') {

      } else {
        return Transition.__super__.prefixValue.apply(this, arguments);
      }
    };

    return Transition;

  })(Declaration);

  module.exports = Transition;

}).call(this);
