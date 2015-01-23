'use strict';

SwaggerEditor.service('Autocomplete', function ($rootScope, snippets,
  ASTManager, KeywordMap) {
  var editor = null;

  function getPathForPosition(pos) {
    // pos.column is 1 more because the character is already inserted
    var path = ASTManager.pathForPosition(pos.row, pos.column - 1);

    return path;
  }

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
      return (new RegExp(matcher[i])).test(path[i]);
    }
    return true;
  }

  /*
  * Get filter function for snippets based on a position (`pos`)
  */
  function filterForSnippets(pos) {
    ASTManager.refresh($rootScope.editorValue);

    var path = getPathForPosition(pos);

    // If there is no path being returned by AST Manager and only one character
    // was typed, path is root
    if (!path && pos.column === 1) {
      path = [];
    }

    return function filter(snippet) {
      return isMatchPath(path, snippet.path);
    };
  }

  /*
   * With a given object returns child that it's key
   * matches `key`
  */
  function getChild(object, key) {
    var keys = Object.keys(object);
    var regex;

    for (var i = 0; i < keys.length; i++) {
      regex = new RegExp(keys[i]);

      if (regex.test(key) && object[keys[i]]) {
        return object[keys[i]];
      }
    }
  }

  /*
   * Get array of keywords base don a position (`pos`)
  */
  function getKeywordsForPosition(pos) {
    var path = getPathForPosition(pos);
    var keywordsMap = KeywordMap.get();
    var key = path.shift();

    if (!Array.isArray(path)) {
      return [];
    }

    while (key && angular.isObject(keywordsMap)) {
      keywordsMap = getChild(keywordsMap, key);
      key = path.shift();
    }

    if (!angular.isObject(keywordsMap)) {
      return [];
    }

    var result = Object.keys(keywordsMap).map(function (keyword) {
      return {
        name: keyword,
        value: keyword,
        score: 300,
        meta: 'swagger'
      };
    });

    return result;
  }

  /*
   * Gives score to snippet based on their position
   * FIXME: right now it gives 100 to any snippet.
  */
  function sortSnippets(snippet) {
    snippet.score = 1000;
    return snippet;
  }

  var KeywordCompleter = {
    getCompletions: function (editor, session, pos, prefix, callback) {
      editor.completer.autoSelect = true;

      var snippetsForPos = snippets.filter(filterForSnippets(pos))
        .map(function (snippet) {
          return {
            caption: snippet.name,
            snippet: snippet.content,
            meta: 'snippet'
          };
        })
        .map(sortSnippets);

      var keywordsForPos = getKeywordsForPosition(pos);

      callback(null, keywordsForPos.concat(snippetsForPos));
    }
  };

  this.init = function (e) {
    editor = e;
    editor.completers = [KeywordCompleter];
  };
});
