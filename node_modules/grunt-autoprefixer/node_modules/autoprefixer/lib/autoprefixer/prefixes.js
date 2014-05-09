(function() {
  var Prefixes, Processor, Selector, Value, utils;

  utils = require('./utils');

  Processor = require('./processor');

  Selector = require('./selector');

  Value = require('./value');

  Value.register(require('./hacks/gradient'));

  Value.register(require('./hacks/fill-available'));

  Selector.register(require('./hacks/fullscreen'));

  Selector.register(require('./hacks/placeholder'));

  Prefixes = (function() {
    function Prefixes(data, browsers) {
      var _ref;
      this.data = data;
      this.browsers = browsers;
      _ref = this.preprocess(this.select(this.data)), this.add = _ref[0], this.remove = _ref[1];
      this.otherCache = {};
      this.processor = new Processor(this);
    }

    Prefixes.prototype.transitionProps = ['transition', 'transition-property'];

    Prefixes.prototype.select = function(list) {
      var add, all, data, name, selected,
        _this = this;
      selected = {
        add: {},
        remove: {}
      };
      for (name in list) {
        data = list[name];
        add = data.browsers.map(function(i) {
          var params;
          params = i.split(' ');
          return {
            browser: params[0] + ' ' + params[1],
            note: params[2]
          };
        });
        add = add.filter(function(i) {
          return _this.browsers.isSelected(i.browser);
        }).map(function(i) {
          var prefix;
          prefix = _this.browsers.prefix(i.browser);
          if (i.note) {
            return prefix + ' ' + i.note;
          } else {
            return prefix;
          }
        });
        add = utils.uniq(add).sort(function(a, b) {
          return b.length - a.length;
        });
        all = data.browsers.map(function(i) {
          return _this.browsers.prefix(i);
        });
        if (data.mistakes) {
          all = all.concat(data.mistakes);
        }
        all = utils.uniq(all);
        if (add.length) {
          selected.add[name] = add;
          if (add.length < all.length) {
            selected.remove[name] = all.filter(function(i) {
              return add.indexOf(i) === -1;
            });
          }
        } else {
          selected.remove[name] = all;
        }
      }
      return selected;
    };

    Prefixes.prototype.preprocess = function(selected) {
      var add, name, old, prefix, prefixed, prefixes, prop, props, remove, selector, value, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1;
      add = {
        selectors: []
      };
      _ref = selected.add;
      for (name in _ref) {
        prefixes = _ref[name];
        if (this.data[name].selector) {
          add.selectors.push(Selector.load(name, prefixes));
        } else {
          props = this.data[name].transition ? this.transitionProps : this.data[name].props;
          if (props) {
            value = Value.load(name, prefixes);
            for (_i = 0, _len = props.length; _i < _len; _i++) {
              prop = props[_i];
              if (!add[prop]) {
                add[prop] = {};
              }
              if (!add[prop].values) {
                add[prop].values = [];
              }
              add[prop].values.push(value);
            }
          }
          if (!this.data[name].props) {
            if (!add[name]) {
              add[name] = {};
            }
            add[name].prefixes = prefixes;
          }
        }
      }
      remove = {
        selectors: []
      };
      _ref1 = selected.remove;
      for (name in _ref1) {
        prefixes = _ref1[name];
        if (this.data[name].selector) {
          selector = Selector.load(name, prefixes);
          for (_j = 0, _len1 = prefixes.length; _j < _len1; _j++) {
            prefix = prefixes[_j];
            remove.selectors.push(selector.prefixed(prefix));
          }
        } else {
          props = this.data[name].transition ? this.transitionProps : this.data[name].props;
          if (props) {
            value = Value.load(name);
            for (_k = 0, _len2 = prefixes.length; _k < _len2; _k++) {
              prefix = prefixes[_k];
              old = value.old(prefix);
              for (_l = 0, _len3 = props.length; _l < _len3; _l++) {
                prop = props[_l];
                if (!remove[prop]) {
                  remove[prop] = {};
                }
                if (!remove[prop].values) {
                  remove[prop].values = [];
                }
                remove[prop].values.push(old);
              }
            }
          }
          if (!this.data[name].props) {
            for (_m = 0, _len4 = prefixes.length; _m < _len4; _m++) {
              prefix = prefixes[_m];
              prefixed = prefix + name;
              if (!remove[prefixed]) {
                remove[prefixed] = {};
              }
              remove[prefixed].remove = true;
            }
          }
        }
      }
      return [add, remove];
    };

    Prefixes.prototype.other = function(prefix) {
      var _base;
      return (_base = this.otherCache)[prefix] || (_base[prefix] = this.browsers.prefixes().filter(function(i) {
        return i !== prefix;
      }));
    };

    Prefixes.prototype.each = function(prop, callback) {
      var prefix, _i, _len, _ref, _results;
      if (this.add[prop] && this.add[prop].prefixes) {
        _ref = this.add[prop].prefixes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          prefix = _ref[_i];
          _results.push(callback(prefix));
        }
        return _results;
      }
    };

    Prefixes.prototype.isCustom = function(prefix) {
      return this.browsers.prefixes().indexOf(prefix) === -1;
    };

    Prefixes.prototype.values = function(type, prop) {
      var data, global, values, _ref, _ref1;
      data = this[type];
      global = (_ref = data['*']) != null ? _ref.values : void 0;
      values = (_ref1 = data[prop]) != null ? _ref1.values : void 0;
      if (global && values) {
        return utils.uniq(global.concat(values));
      } else {
        return global || values || [];
      }
    };

    Prefixes.prototype.toRemove = function(prop) {
      var _ref;
      return (_ref = this.remove[prop]) != null ? _ref.remove : void 0;
    };

    return Prefixes;

  })();

  module.exports = Prefixes;

}).call(this);
