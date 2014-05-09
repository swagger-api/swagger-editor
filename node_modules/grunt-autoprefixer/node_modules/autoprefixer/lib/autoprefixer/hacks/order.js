(function() {
  var FlexDeclaration, Order,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = require('./flex-declaration');

  Order = (function(_super) {
    __extends(Order, _super);

    Order.names = ['order', 'flex-order', 'box-ordinal-group'];

    function Order() {
      Order.__super__.constructor.apply(this, arguments);
      this.unprefixed = 'order';
      this.prop = this.prefix + this.unprefixed;
    }

    Order.prototype.prefixProp = function(prefix) {
      var oldValue, spec, _ref;
      _ref = this.flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === '2009') {
        oldValue = parseInt(this.value) + 1;
        return this.insertBefore(prefix + 'box-ordinal-group', oldValue.toString());
      } else if (spec === '2012') {
        return this.insertBefore(prefix + 'flex-order', this.value);
      } else if (spec === 'final') {
        return Order.__super__.prefixProp.apply(this, arguments);
      }
    };

    return Order;

  })(FlexDeclaration);

  module.exports = Order;

}).call(this);
