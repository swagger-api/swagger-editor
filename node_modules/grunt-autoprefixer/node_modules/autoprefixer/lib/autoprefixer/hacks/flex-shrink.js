(function() {
  var FlexDeclaration, FlexShrink, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = require('./flex-declaration');

  FlexShrink = (function(_super) {
    __extends(FlexShrink, _super);

    function FlexShrink() {
      _ref = FlexShrink.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FlexShrink.names = ['flex-shrink'];

    FlexShrink.prototype.prefixProp = function(prefix) {
      var spec, _ref1;
      _ref1 = this.flexSpec(prefix), spec = _ref1[0], prefix = _ref1[1];
      if (spec === '2012') {
        return this.insertBefore(prefix + 'flex', '0 ' + this.value);
      } else if (spec === 'final') {
        return FlexShrink.__super__.prefixProp.apply(this, arguments);
      }
    };

    return FlexShrink;

  })(FlexDeclaration);

  module.exports = FlexShrink;

}).call(this);
