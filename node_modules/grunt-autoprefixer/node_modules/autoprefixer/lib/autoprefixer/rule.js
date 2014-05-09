(function() {
  var Declaration, Rule, utils;

  utils = require('./utils');

  Declaration = require('./declaration');

  Declaration.register(require('./hacks/filter'));

  Declaration.register(require('./hacks/border-radius'));

  Declaration.register(require('./hacks/flex'));

  Declaration.register(require('./hacks/order'));

  Declaration.register(require('./hacks/flex-grow'));

  Declaration.register(require('./hacks/flex-wrap'));

  Declaration.register(require('./hacks/flex-flow'));

  Declaration.register(require('./hacks/transition'));

  Declaration.register(require('./hacks/align-self'));

  Declaration.register(require('./hacks/flex-basis'));

  Declaration.register(require('./hacks/flex-shrink'));

  Declaration.register(require('./hacks/align-items'));

  Declaration.register(require('./hacks/border-image'));

  Declaration.register(require('./hacks/display-flex'));

  Declaration.register(require('./hacks/align-content'));

  Declaration.register(require('./hacks/flex-direction'));

  Declaration.register(require('./hacks/justify-content'));

  Rule = (function() {
    function Rule(rules, number, node, prefix) {
      var match;
      this.rules = rules;
      this.number = number;
      this.node = node;
      this.prefix = prefix;
      this.type = this.node.type;
      this.declarations = this.node.declarations;
      if (this.type === 'rule') {
        this.selectors = this.node.selectors.join(', ');
        if (!this.prefix) {
          match = this.selectors.match(/(^|\s|:)(-(\w+)-)/);
          if (match) {
            this.prefix = match[2];
          }
        }
      }
    }

    Rule.prototype.each = function(callback) {
      var decl, item;
      this.number = 0;
      while (this.number < this.declarations.length) {
        item = this.declarations[this.number];
        if (item.property) {
          decl = Declaration.load(this, this.number, item);
          callback(decl, decl.prefix || this.prefix);
        }
        this.number += 1;
      }
      return false;
    };

    Rule.prototype.prefixSelector = function(selector) {
      var clone, prefix, prefixed, _i, _len, _ref, _results;
      _ref = selector.prefixes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        prefix = _ref[_i];
        prefixed = selector.replace(this.selectors, prefix);
        if (!this.rules.contain(prefixed)) {
          clone = utils.clone(this.node, {
            selectors: prefixed.split(', ')
          });
          _results.push(this.rules.add(this.number, clone));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Rule.prototype.contain = function(prop, value) {
      if (value != null) {
        return this.declarations.some(function(i) {
          return i.property === prop && i.value === value;
        });
      } else {
        return this.declarations.some(function(i) {
          return i.property === prop;
        });
      }
    };

    Rule.prototype.byProp = function(prop) {
      var decl, i, node, _i, _len, _ref;
      _ref = this.declarations;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        node = _ref[i];
        if (node.property) {
          decl = Declaration.load(this, i, node);
          if (decl.prop === prop) {
            return decl;
          }
        }
      }
      return null;
    };

    Rule.prototype.remove = function() {
      return this.rules.remove(this.number);
    };

    Rule.prototype.add = function(position, decl) {
      this.declarations.splice(position, 0, decl);
      return this.number += 1;
    };

    Rule.prototype.removeDecl = function(position) {
      this.declarations.splice(position, 1);
      return this.number -= 1;
    };

    return Rule;

  })();

  module.exports = Rule;

}).call(this);
