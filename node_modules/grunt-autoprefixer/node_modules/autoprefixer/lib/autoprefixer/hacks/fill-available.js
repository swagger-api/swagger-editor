(function() {
  var FillAvailable, OldValue, Value, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  OldValue = require('../old-value');

  Value = require('../value');

  utils = require('../utils');

  FillAvailable = (function(_super) {
    __extends(FillAvailable, _super);

    function FillAvailable() {
      _ref = FillAvailable.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FillAvailable.names = ['fill-available'];

    FillAvailable.prototype.addPrefix = function(prefix, string) {
      if (prefix === '-moz-') {
        return string.replace(this.regexp, '$1-moz-available$3');
      } else {
        return FillAvailable.__super__.addPrefix.apply(this, arguments);
      }
    };

    FillAvailable.prototype.old = function(prefix) {
      if (prefix === '-moz-') {
        return new OldValue('-moz-available');
      } else {
        return FillAvailable.__super__.old.apply(this, arguments);
      }
    };

    return FillAvailable;

  })(Value);

  module.exports = FillAvailable;

}).call(this);
