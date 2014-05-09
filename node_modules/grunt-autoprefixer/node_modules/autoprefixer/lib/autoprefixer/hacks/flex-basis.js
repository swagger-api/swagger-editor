(function() {
  var FlexBasis, FlexDeclaration, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = require('./flex-declaration');

  FlexBasis = (function(_super) {
    __extends(FlexBasis, _super);

    function FlexBasis() {
      _ref = FlexBasis.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FlexBasis.names = ['flex-basis'];

    FlexBasis.prototype.prefixProp = function(prefix) {
      var spec, _ref1;
      _ref1 = this.flexSpec(prefix), spec = _ref1[0], prefix = _ref1[1];
      if (spec === '2012') {
        return this.insertBefore(prefix + 'flex', '0 1 ' + this.value);
      } else if (spec === 'final') {
        return FlexBasis.__super__.prefixProp.apply(this, arguments);
      }
    };

    return FlexBasis;

  })(FlexDeclaration);

  module.exports = FlexBasis;

}).call(this);
