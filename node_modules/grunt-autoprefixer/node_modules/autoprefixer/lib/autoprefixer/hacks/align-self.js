(function() {
  var AlignSelf, FlexDeclaration,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = require('./flex-declaration');

  AlignSelf = (function(_super) {
    __extends(AlignSelf, _super);

    AlignSelf.names = ['align-self', 'flex-item-align'];

    AlignSelf.oldValues = {
      'flex-end': 'end',
      'flex-start': 'start'
    };

    function AlignSelf() {
      AlignSelf.__super__.constructor.apply(this, arguments);
      this.unprefixed = 'align-self';
      this.prop = this.prefix + this.unprefixed;
    }

    AlignSelf.prototype.prefixProp = function(prefix) {
      var oldValue, spec, _ref;
      _ref = this.flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === '2012') {
        oldValue = AlignSelf.oldValues[this.value] || this.value;
        return this.insertBefore(prefix + 'flex-item-align', oldValue);
      } else if (spec === 'final') {
        return AlignSelf.__super__.prefixProp.apply(this, arguments);
      }
    };

    return AlignSelf;

  })(FlexDeclaration);

  module.exports = AlignSelf;

}).call(this);
