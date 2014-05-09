(function() {
  var FlexDeclaration, FlexWrap, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = require('./flex-declaration');

  FlexWrap = (function(_super) {
    __extends(FlexWrap, _super);

    function FlexWrap() {
      _ref = FlexWrap.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FlexWrap.names = ['flex-wrap'];

    FlexWrap.prototype.prefixProp = function(prefix) {
      var spec, _ref1;
      _ref1 = this.flexSpec(prefix), spec = _ref1[0], prefix = _ref1[1];
      if (spec === '2012') {
        return FlexWrap.__super__.prefixProp.apply(this, arguments);
      } else if (spec === 'final') {
        return FlexWrap.__super__.prefixProp.apply(this, arguments);
      }
    };

    return FlexWrap;

  })(FlexDeclaration);

  module.exports = FlexWrap;

}).call(this);
