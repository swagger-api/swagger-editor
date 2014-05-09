(function() {
  var Flex, FlexDeclaration,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = require('./flex-declaration');

  Flex = (function(_super) {
    __extends(Flex, _super);

    Flex.names = ['flex', 'box-flex'];

    function Flex() {
      Flex.__super__.constructor.apply(this, arguments);
      this.unprefixed = 'flex';
      this.prop = this.prefix + this.unprefixed;
    }

    Flex.prototype.prefixProp = function(prefix) {
      var first, spec, _ref;
      _ref = this.flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === '2009') {
        first = this.value.split(' ')[0];
        return this.insertBefore(prefix + 'box-flex', first);
      } else if (spec === '2012') {
        return Flex.__super__.prefixProp.apply(this, arguments);
      } else if (spec === 'final') {
        return Flex.__super__.prefixProp.apply(this, arguments);
      }
    };

    return Flex;

  })(FlexDeclaration);

  module.exports = Flex;

}).call(this);
