(function() {
  var Declaration, FlexDeclaration, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Declaration = require('../declaration');

  FlexDeclaration = (function(_super) {
    __extends(FlexDeclaration, _super);

    function FlexDeclaration() {
      _ref = FlexDeclaration.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FlexDeclaration.prototype.flexSpec = function(prefix) {
      var spec;
      spec = prefix === '-webkit- 2009' || prefix === '-moz-' ? '2009' : prefix === '-ms-' ? '2012' : prefix === '-webkit-' ? 'final' : void 0;
      if (prefix === '-webkit- 2009') {
        prefix = '-webkit-';
      }
      return [spec, prefix];
    };

    return FlexDeclaration;

  })(Declaration);

  module.exports = FlexDeclaration;

}).call(this);
