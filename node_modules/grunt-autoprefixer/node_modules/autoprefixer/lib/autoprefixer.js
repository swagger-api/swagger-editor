(function() {
  var Autoprefixer, Browsers, CSS, Prefixes, autoprefixer, inspectCache, parse, stringify,
    __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  parse = require('css-parse');

  stringify = require('css-stringify');

  Browsers = require('./autoprefixer/browsers');

  Prefixes = require('./autoprefixer/prefixes');

  CSS = require('./autoprefixer/css');

  inspectCache = null;

  autoprefixer = function() {
    var browsers, prefixes, reqs;
    reqs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (reqs.length === 1 && reqs[0] instanceof Array) {
      reqs = reqs[0];
    } else if (reqs.length === 0 || (reqs.length === 1 && (reqs[0] == null))) {
      reqs = void 0;
    }
    if (reqs == null) {
      reqs = autoprefixer["default"];
    }
    browsers = new Browsers(autoprefixer.data.browsers, reqs);
    prefixes = new Prefixes(autoprefixer.data.prefixes, browsers);
    return new Autoprefixer(prefixes, autoprefixer.data);
  };

  autoprefixer.data = {
    browsers: require('../data/browsers'),
    prefixes: require('../data/prefixes')
  };

  Autoprefixer = (function() {
    function Autoprefixer(prefixes, data) {
      this.prefixes = prefixes;
      this.data = data;
      this.rework = __bind(this.rework, this);
      this.browsers = this.prefixes.browsers.selected;
    }

    Autoprefixer.prototype.compile = function(str) {
      var nodes,
        _this = this;
      nodes = this.catchParseErrors(function() {
        return parse(_this.removeBadComments(str));
      });
      this.rework(nodes.stylesheet);
      return stringify(nodes);
    };

    Autoprefixer.prototype.rework = function(stylesheet) {
      var css;
      css = new CSS(stylesheet);
      this.prefixes.processor.add(css);
      return this.prefixes.processor.remove(css);
    };

    Autoprefixer.prototype.inspect = function() {
      inspectCache || (inspectCache = require('./autoprefixer/inspect'));
      return inspectCache(this.prefixes);
    };

    Autoprefixer.prototype.catchParseErrors = function(callback) {
      var e, error;
      try {
        return callback();
      } catch (_error) {
        e = _error;
        error = new Error("Can't parse CSS: " + e.message);
        error.stack = e.stack;
        error.css = true;
        throw error;
      }
    };

    Autoprefixer.prototype.removeBadComments = function(css) {
      return css.replace(/\/\*[^\*]*\}[^\*]*\*\//g, '');
    };

    return Autoprefixer;

  })();

  autoprefixer["default"] = ['> 1%', 'last 2 versions', 'ff 24', 'opera 12.1'];

  autoprefixer.loadDefault = function() {
    return this.defaultCache || (this.defaultCache = autoprefixer(this["default"]));
  };

  autoprefixer.compile = function(str) {
    return this.loadDefault().compile(str);
  };

  autoprefixer.rework = function(stylesheet) {
    return this.loadDefault().rework(stylesheet);
  };

  autoprefixer.inspect = function() {
    return this.loadDefault().inspect();
  };

  module.exports = autoprefixer;

}).call(this);
