(function() {
  var DisplayFlex, FlexDeclaration,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = require('./flex-declaration');

  DisplayFlex = (function(_super) {
    __extends(DisplayFlex, _super);

    DisplayFlex.names = ['display'];

    function DisplayFlex() {
      var name, prefix, _ref;
      DisplayFlex.__super__.constructor.apply(this, arguments);
      _ref = FlexDeclaration.split(this.value), prefix = _ref[0], name = _ref[1];
      if (name === 'flex' || name === 'box' || name === 'flexbox') {
        this.prefix = prefix;
        this.unprefixed = 'display-flex';
        this.prop = this.prefix + this.unprefixed;
      } else if (name === 'inline-flex' || name === 'inline-flexbox') {
        this.prefix = prefix;
        this.unprefixed = 'display-flex';
        this.prop = this.prefix + this.unprefixed;
        this.inline = true;
      }
    }

    DisplayFlex.prototype.prefixProp = function(prefix) {
      var spec, _ref;
      if (this.unprefixed !== 'display-flex') {
        return DisplayFlex.__super__.prefixProp.apply(this, arguments);
      } else {
        _ref = this.flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
        if (spec === '2009') {
          if (!this.inline) {
            return this.prefixDisplay(prefix, 'box');
          }
        } else if (spec === '2012') {
          return this.prefixDisplay(prefix, this.inline ? 'inline-flexbox' : 'flexbox');
        } else if (spec === 'final') {
          return this.prefixDisplay(prefix, this.inline ? 'inline-flex' : 'flex');
        }
      }
    };

    DisplayFlex.prototype.prefixDisplay = function(prefix, name) {
      return this.insertBefore('display', prefix + name);
    };

    return DisplayFlex;

  })(FlexDeclaration);

  module.exports = DisplayFlex;

}).call(this);
