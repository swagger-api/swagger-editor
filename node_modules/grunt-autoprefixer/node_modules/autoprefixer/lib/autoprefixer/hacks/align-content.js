(function() {
  var AlignContent, FlexDeclaration,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = require('./flex-declaration');

  AlignContent = (function(_super) {
    __extends(AlignContent, _super);

    AlignContent.names = ['align-content', 'flex-line-pack'];

    AlignContent.oldValues = {
      'flex-end': 'end',
      'flex-start': 'start',
      'space-between': 'justify',
      'space-around': 'distribute'
    };

    function AlignContent() {
      AlignContent.__super__.constructor.apply(this, arguments);
      this.unprefixed = 'align-content';
      this.prop = this.prefix + this.unprefixed;
    }

    AlignContent.prototype.prefixProp = function(prefix) {
      var oldValue, spec, _ref;
      _ref = this.flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === '2012') {
        oldValue = AlignContent.oldValues[this.value] || this.value;
        return this.insertBefore(prefix + 'flex-line-pack', oldValue);
      } else if (spec === 'final') {
        return AlignContent.__super__.prefixProp.apply(this, arguments);
      }
    };

    return AlignContent;

  })(FlexDeclaration);

  module.exports = AlignContent;

}).call(this);
