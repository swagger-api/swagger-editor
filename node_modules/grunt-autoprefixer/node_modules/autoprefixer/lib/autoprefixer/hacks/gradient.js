(function() {
  var Gradient, OldValue, Value, isDirection, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  OldValue = require('../old-value');

  Value = require('../value');

  utils = require('../utils');

  isDirection = new RegExp('(top|left|right|bottom)', 'gi');

  Gradient = (function(_super) {
    var i, _i, _len, _ref;

    __extends(Gradient, _super);

    Gradient.names = ['linear-gradient', 'repeating-linear-gradient', 'radial-gradient', 'repeating-radial-gradient'];

    Gradient.starts = new RegExp('(^|\\s*)' + Gradient.names.join('|'), 'i');

    Gradient.regexps = {};

    _ref = Gradient.names;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      Gradient.regexps[i] = new RegExp('(^|\\s|,)' + i + '\\((.+)\\)', 'gi');
    }

    function Gradient(name, prefixes) {
      this.name = name;
      this.prefixes = prefixes;
      this.regexp = Gradient.regexps[this.name];
    }

    Gradient.prototype.addPrefix = function(prefix, string) {
      var _this = this;
      return string.replace(this.regexp, function(all, before, args) {
        var decl, prefixedDecls, _j, _len1, _ref1;
        prefixedDecls = [];
        _ref1 = _this.splitDecls(all);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          decl = _ref1[_j];
          prefixedDecls.push(decl.replace(_this.regexp, function(all, before, args) {
            var params;
            params = _this.splitParams(args);
            params = _this.newDirection(params);
            if (prefix === '-webkit- old') {
              if (_this.name !== 'linear-gradient') {
                return all;
              }
              if (params[0] && params[0].indexOf('deg') !== -1) {
                return all;
              }
              if (args.indexOf('-corner') !== -1) {
                return all;
              }
              if (args.indexOf('-side') !== -1) {
                return all;
              }
              params = _this.oldDirection(params);
              params = _this.colorStops(params);
              return '-webkit-gradient(linear, ' + params.join(', ') + ')';
            } else {
              if (params.length > 0) {
                if (params[0].slice(0, 3) === 'to ') {
                  params[0] = _this.fixDirection(params[0]);
                } else if (params[0].indexOf('deg') !== -1) {
                  params[0] = _this.fixAngle(params[0]);
                } else if (params[0].indexOf(' at ') !== -1) {
                  _this.fixRadial(params);
                }
              }
              return before + prefix + _this.name + '(' + params.join(', ') + ')';
            }
          }));
        }
        return prefixedDecls.join(',');
      });
    };

    Gradient.prototype.directions = {
      top: 'bottom',
      left: 'right',
      bottom: 'top',
      right: 'left'
    };

    Gradient.prototype.oldDirections = {
      'top': 'left bottom, left top',
      'left': 'right top, left top',
      'bottom': 'left top, left bottom',
      'right': 'left top, right top',
      'top right': 'left bottom, right top',
      'top left': 'right bottom, left top',
      'bottom right': 'left top, right bottom',
      'bottom left': 'right top, left bottom'
    };

    Gradient.prototype.splitDecls = function(decl) {
      var chunks, currentDecl, decls, _j, _len1;
      decls = [];
      chunks = decl.split(',');
      currentDecl = [];
      for (_j = 0, _len1 = chunks.length; _j < _len1; _j++) {
        i = chunks[_j];
        if (Gradient.starts.test(i)) {
          if (currentDecl.length === 0) {
            currentDecl.push(i);
          } else {
            decls.push(currentDecl.join(','));
            currentDecl = [i];
          }
        } else {
          currentDecl.push(i);
        }
      }
      decls.push(currentDecl.join(','));
      return decls;
    };

    Gradient.prototype.splitParams = function(params) {
      var array, char, func, param, _j, _len1;
      array = [];
      param = '';
      func = 0;
      for (_j = 0, _len1 = params.length; _j < _len1; _j++) {
        char = params[_j];
        if (char === ')' && func > 0) {
          func -= 1;
          param += char;
        } else if (char === '(') {
          param += char;
          func += 1;
        } else if (func > 0) {
          param += char;
        } else if (char === ',') {
          array.push(param.trim());
          param = '';
        } else {
          param += char;
        }
      }
      array.push(param.trim());
      return array;
    };

    Gradient.prototype.newDirection = function(params) {
      var first, value;
      first = params[0];
      if (first.indexOf('to ') === -1 && isDirection.test(first)) {
        first = first.split(' ');
        first = (function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = first.length; _j < _len1; _j++) {
            value = first[_j];
            _results.push(this.directions[value.toLowerCase()] || value);
          }
          return _results;
        }).call(this);
        params[0] = 'to ' + first.join(' ');
      }
      return params;
    };

    Gradient.prototype.fixDirection = function(param) {
      var value;
      param = param.split(' ');
      param.splice(0, 1);
      param = (function() {
        var _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = param.length; _j < _len1; _j++) {
          value = param[_j];
          _results.push(this.directions[value.toLowerCase()] || value);
        }
        return _results;
      }).call(this);
      return param.join(' ');
    };

    Gradient.prototype.roundFloat = function(float, digits) {
      return parseFloat(float.toFixed(digits));
    };

    Gradient.prototype.fixAngle = function(param) {
      param = parseFloat(param);
      param = Math.abs(450 - param) % 360;
      param = this.roundFloat(param, 3);
      return "" + param + "deg";
    };

    Gradient.prototype.fixRadial = function(params) {
      var first;
      first = params[0].split(/\s+at\s+/);
      return params.splice(0, 1, first[1], first[0]);
    };

    Gradient.prototype.oldDirection = function(params) {
      var direction;
      if (params.length === 0) {
        params;
      }
      if (params[0].indexOf('to ') !== -1) {
        direction = params[0].replace(/^to\s+/, '');
        direction = this.oldDirections[direction];
        params[0] = direction;
        return params;
      } else {
        direction = this.oldDirections.bottom;
        return [direction].concat(params);
      }
    };

    Gradient.prototype.colorStops = function(params) {
      return params.map(function(param, i) {
        var color, position, separator;
        if (i === 0) {
          return param;
        }
        separator = param.lastIndexOf(' ');
        if (separator === -1) {
          color = param;
          position = void 0;
        } else {
          color = param.slice(0, separator);
          position = param.slice(separator + 1);
        }
        if (position && position.indexOf(')') !== -1) {
          color += ' ' + position;
          position = void 0;
        }
        if (i === 1) {
          return "from(" + color + ")";
        } else if (i === params.length - 1) {
          return "to(" + color + ")";
        } else if (position) {
          return "color-stop(" + position + ", " + color + ")";
        } else {
          return "color-stop(" + color + ")";
        }
      });
    };

    Gradient.prototype.old = function(prefix) {
      var regexp, string, type;
      if (prefix === '-webkit-') {
        type = this.name === 'linear-gradient' ? 'linear' : 'radial';
        string = '-gradient';
        regexp = utils.regexp("-webkit-(" + type + "-gradient|gradient\\(\\s*" + type + ")", false);
        return new OldValue(prefix + this.name, string, regexp);
      } else {
        return Gradient.__super__.old.apply(this, arguments);
      }
    };

    return Gradient;

  })(Value);

  module.exports = Gradient;

}).call(this);
