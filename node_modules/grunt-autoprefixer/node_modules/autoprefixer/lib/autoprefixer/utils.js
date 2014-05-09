(function() {
  module.exports = {
    error: function(text) {
      var err;
      err = new Error(text);
      err.autoprefixer = true;
      throw err;
    },
    uniq: function(array) {
      var filtered, i, _i, _len;
      filtered = [];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        i = array[_i];
        if (filtered.indexOf(i) === -1) {
          filtered.push(i);
        }
      }
      return filtered;
    },
    clone: function(obj, changes) {
      var clone, key, value;
      if (changes == null) {
        changes = {};
      }
      clone = {};
      for (key in obj) {
        value = obj[key];
        if (!changes[key]) {
          if (value instanceof Array) {
            clone[key] = value.slice(0);
          } else {
            clone[key] = value;
          }
        }
      }
      for (key in changes) {
        value = changes[key];
        clone[key] = value;
      }
      return clone;
    },
    removeNote: function(string) {
      if (string.indexOf(' ') === -1) {
        return string;
      } else {
        return string.split(' ')[0];
      }
    },
    escapeRegexp: function(string) {
      return string.replace(/([.?*+\^\$\[\]\\(){}|\-])/g, "\\$1");
    },
    regexp: function(word, escape) {
      if (escape == null) {
        escape = true;
      }
      if (escape) {
        word = this.escapeRegexp(word);
      }
      return new RegExp('(^|\\s|,|\\()(' + word + '($|\\s|\\(|,))', 'gi');
    }
  };

}).call(this);
