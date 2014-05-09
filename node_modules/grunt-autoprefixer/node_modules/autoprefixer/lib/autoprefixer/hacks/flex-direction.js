(function() {
  var FlexDeclaration, FlexDirection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = require('./flex-declaration');

  FlexDirection = (function(_super) {
    __extends(FlexDirection, _super);

    FlexDirection.names = ['flex-direction', 'box-direction', 'box-orient'];

    function FlexDirection() {
      FlexDirection.__super__.constructor.apply(this, arguments);
      this.unprefixed = 'flex-direction';
      this.prop = this.prefix + this.unprefixed;
    }

    FlexDirection.prototype.prefixProp = function(prefix) {
      var dir, orient, spec, _ref;
      _ref = this.flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === '2009') {
        orient = this.value.indexOf('row') !== -1 ? 'horizontal' : 'vertical';
        this.insertBefore(prefix + 'box-orient', orient);
        dir = this.value.indexOf('reverse') !== -1 ? 'reverse' : 'normal';
        return this.insertBefore(prefix + 'box-direction', dir);
      } else {
        return FlexDirection.__super__.prefixProp.apply(this, arguments);
      }
    };

    return FlexDirection;

  })(FlexDeclaration);

  module.exports = FlexDirection;

}).call(this);
