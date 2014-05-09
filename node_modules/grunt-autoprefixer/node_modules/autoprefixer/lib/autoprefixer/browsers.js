(function() {
  var Browsers, utils;

  utils = require('./utils');

  Browsers = (function() {
    function Browsers(data, requirements) {
      this.data = data;
      this.selected = this.parse(requirements);
    }

    Browsers.prototype.parse = function(requirements) {
      var selected,
        _this = this;
      if (!(requirements instanceof Array)) {
        requirements = [requirements];
      }
      selected = [];
      requirements.map(function(req) {
        var i, match, name, _ref;
        _ref = _this.requirements;
        for (name in _ref) {
          i = _ref[name];
          if (match = req.match(i.regexp)) {
            selected = selected.concat(i.select.apply(_this, match.slice(1)));
            return;
          }
        }
        return utils.error("Unknown browser requirement `" + req + "`");
      });
      return utils.uniq(selected);
    };

    Browsers.prototype.aliases = {
      fx: 'ff'
    };

    Browsers.prototype.requirements = {
      none: {
        regexp: /^none$/i,
        select: function() {
          return [];
        }
      },
      lastVersions: {
        regexp: /^last (\d+) versions?$/i,
        select: function(versions) {
          return this.browsers(function(data) {
            if (data.minor) {
              return [];
            } else {
              return data.versions.slice(0, versions);
            }
          });
        }
      },
      globalStatistics: {
        regexp: /^> (\d+(\.\d+)?)%$/,
        select: function(popularity) {
          return this.browsers(function(data) {
            return data.versions.filter(function(version, i) {
              return data.popularity[i] > popularity;
            });
          });
        }
      },
      newerThen: {
        regexp: /^(\w+) (>=?)\s*([\d\.]+)/,
        select: function(browser, sign, version) {
          var data, filter;
          browser = this.aliases[browser] || browser;
          data = this.data[browser];
          version = parseFloat(version);
          if (!data) {
            utils.error("Unknown browser " + browser);
          }
          if (sign === '>') {
            filter = function(v) {
              return v > version;
            };
          } else if (sign === '>=') {
            filter = function(v) {
              return v >= version;
            };
          }
          return data.versions.filter(filter).map(function(v) {
            return "" + browser + " " + v;
          });
        }
      },
      direct: {
        regexp: /^(\w+) ([\d\.]+)$/,
        select: function(browser, version) {
          var data, first, last;
          browser = this.aliases[browser] || browser;
          data = this.data[browser];
          version = parseFloat(version);
          if (!data) {
            utils.error("Unknown browser " + browser);
          }
          last = data.future ? data.future[0] : data.versions[0];
          first = data.versions[data.versions.length - 1];
          if (version > last) {
            version = last;
          } else if (version < first) {
            version = first;
          }
          return ["" + browser + " " + version];
        }
      }
    };

    Browsers.prototype.browsers = function(criteria) {
      var browser, data, selected, versions, _ref;
      selected = [];
      _ref = this.data;
      for (browser in _ref) {
        data = _ref[browser];
        versions = criteria(data).map(function(version) {
          return "" + browser + " " + version;
        });
        selected = selected.concat(versions);
      }
      return selected;
    };

    Browsers.prototype.prefixes = function() {
      var i, name;
      return this.prefixesCache || (this.prefixesCache = utils.uniq((function() {
        var _ref, _results;
        _ref = this.data;
        _results = [];
        for (name in _ref) {
          i = _ref[name];
          _results.push(i.prefix);
        }
        return _results;
      }).call(this)).sort(function(a, b) {
        return b.length - a.length;
      }));
    };

    Browsers.prototype.prefix = function(browser) {
      var name, version, _ref;
      _ref = browser.split(' '), name = _ref[0], version = _ref[1];
      if (name === 'opera' && parseFloat(version) >= 15) {
        return '-webkit-';
      } else {
        return this.data[name].prefix;
      }
    };

    Browsers.prototype.isSelected = function(browser) {
      return this.selected.indexOf(browser) !== -1;
    };

    return Browsers;

  })();

  module.exports = Browsers;

}).call(this);
