'use strict';

PhonicsApp.service('Autocomplete', function Autocomplete(snippets, ASTManager,
  Resolver) {
  var langTools = ace.require('ace/ext/language_tools');
  var snippetManager = ace.require('ace/snippets').snippetManager;
  var editor = null;
  /*
   * Check if a path is match with
   * @param {array} path - path
   * @param {array} matcher - matcher
   * @returns {boolean} - true if it's match
  */
  function isMatchPath(path, matcher) {
    if (!Array.isArray(path) || !Array.isArray(matcher)) {
      return false;
    }

    if (path.length !== matcher.length) {
      return false;
    }

    for (var i = 0; i < path.length; i++) {
      if (path[i] !== matcher[i]) {
        return false;
      }
    }
    return true;
  }

  function filterForSnippets(pos) {
    ASTManager.refresh(editor.getValue());
    var path = ASTManager.pathForLine(pos.row);

    // If there is no path being returned by AST Manager and only one character
    // was typed, path is root
    if (!path && pos.column === 1) {
      path = [];
    }

    return function filter(snippet) {
      return isMatchPath(path, snippet.path);
    };
  }

  function getKeywordsForPosition(pos) {
    var path = ASTManager.pathForLine(pos.row);
    schema = Resolver.resolve(schema);
    var key;

    if (!Array.isArray(path)) {
      return [];
    }

    while (path.length && schema.properties) {
      key = path.pop();
      schema = schema.properties[key];
    }

    return Object.keys(schema.properties).map(function(keyword) {
      return {
        name: keyword,
        value: keyword,
        score: 300
      };
    });
  }

  var ASTCompleter = {
    getCompletions: function (editor, session, pos, prefix, callback) {

      editor.completer.autoSelect = true;

      snippetManager.unregister(snippets, 'yaml');
      snippetManager.register(snippets.filter(filterForSnippets(pos)), 'yaml');

      langTools.snippetCompleter
        .getCompletions(editor, session, pos, prefix, callback);

      callback(null, getKeywordsForPosition(pos));
    }
  };

  this.init = function (e) {
    editor = e;
    editor.completers = [ASTCompleter];
  };
});
