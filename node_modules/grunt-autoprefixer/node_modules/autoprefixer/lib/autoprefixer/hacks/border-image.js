(function() {
  var BorderImage, Declaration, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Declaration = require('../declaration');

  BorderImage = (function(_super) {
    __extends(BorderImage, _super);

    function BorderImage() {
      _ref = BorderImage.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BorderImage.names = ['border-image'];

    BorderImage.prototype.prefixProp = function(prefix) {
      return BorderImage.__super__.prefixProp.call(this, prefix, this.value.replace(/\s+fill(\s)/, '$1'));
    };

    return BorderImage;

  })(Declaration);

  module.exports = BorderImage;

}).call(this);
