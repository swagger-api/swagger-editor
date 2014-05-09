(function() {
  var FlexDeclaration, FlexFlow, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = require('./flex-declaration');

  FlexFlow = (function(_super) {
    __extends(FlexFlow, _super);

    function FlexFlow() {
      _ref = FlexFlow.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FlexFlow.names = ['flex-flow'];

    FlexFlow.prototype.prefixProp = function(prefix) {
      var spec, _ref1;
      _ref1 = this.flexSpec(prefix), spec = _ref1[0], prefix = _ref1[1];
      if (spec === '2012') {
        return FlexFlow.__super__.prefixProp.apply(this, arguments);
      } else if (spec === 'final') {
        return FlexFlow.__super__.prefixProp.apply(this, arguments);
      }
    };

    return FlexFlow;

  })(FlexDeclaration);

  module.exports = FlexFlow;

}).call(this);
