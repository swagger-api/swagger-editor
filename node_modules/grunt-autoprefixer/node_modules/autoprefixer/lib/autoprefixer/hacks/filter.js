(function() {
  var Declaration, Filter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Declaration = require('../declaration');

  Filter = (function(_super) {
    __extends(Filter, _super);

    Filter.names = ['filter'];

    function Filter() {
      Filter.__super__.constructor.apply(this, arguments);
      if (this.value.indexOf('DXImageTransform.Microsoft') !== -1 || this.value.indexOf('alpha(') !== -1) {
        this.unprefixed = this.prop = '-ms-filter';
      }
    }

    return Filter;

  })(Declaration);

  module.exports = Filter;

}).call(this);
