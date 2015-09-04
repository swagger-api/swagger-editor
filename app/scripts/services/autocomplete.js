'use strict';

/*
 * Autocomplete service extends Ace's completion mechanism to provide more
 * relevant completion candidates based on Swagger document.
*/
SwaggerEditor.service('Autocomplete', function ($rootScope, snippets,
  KeywordMap, Preferences, ASTManager) {
  var editor = null;

  // Ace KeywordCompleter object
  var KeywordCompleter = {

    // this method is being called by Ace to get a list of completion candidates
    getCompletions: function (editor, session, pos, prefix, callback) {

      // Do not make any suggestions when autoComplete preference is off
      if (!Preferences.get('autoComplete')) {
        return callback(null, []);
      }

      // Let Ace select the first candidate
      editor.completer.autoSelect = true;

      Promise.all([
        getKeywordsForPosition(pos),
        getSnippetsForPosition(pos)
      ]).then(function (results) {
        var keywordsForPos = _.isArray(results[0]) ? results[0] : [];
        var snippetsForPos = _.isArray(results[1]) ? results[1] : [];

        callback(null, keywordsForPos.concat(snippetsForPos));
      });
    }
  };

  /*
   * Initializes autocomplete service. This method should be called after editor
   *   is ready
   *
   * @param {object} e - the Ace editor object
  */
  this.init = function (e) {
    editor = e;
    editor.completers = [KeywordCompleter];
  };

  /*
   * Construct an Ace compatible snippet from a snippet object that is made from
   *  snippets made from our snippets
   *
   * @param {object} snippet - a snippet from snippet.js file
   *
   * @returns {object} - an Ace compatible snippet object
  */
  function constructAceSnippet(snippet) {
    return {
      caption: snippet.name,
      snippet: snippet.content,
      meta: 'snippet'
    };
  }

  /*
   * Gets keyword path for specified position
   *
   * @param {position} pos - AST Mark position
   *
   * @returns {Promise<array>} - a list of keywords to reach to provided
   *   position based in the YAML document
  */
  function getPathForPosition(pos) {

    return ASTManager.pathForPosition($rootScope.editorValue, {
      line: pos.row + 1,
      column: pos.column + 1
    });
  }

  /*
   * Check if a path is match with a matcher path
   * @param {array} path - path
   * @param {array} matcher - matcher
   * @returns {boolean} - true if it's match
  */
  function isMatchPath(path, matcher) {
    if (!_.isArray(path) || !_.isArray(matcher)) {
      return false;
    }

    if (path.length !== matcher.length) {
      return false;
    }

    for (var i = 0, l = path.length; i < l; i++) {
      var matches = (new RegExp(matcher[i])).test(path[i]);

      // if it's not matching quickly return false
      if (!matches) {
        return false;

      // only return true if it's last item in path and it matches
      } else if (i === l - 1) {
        return true;
      }
    }

    return true;
  }

  /*
   * Gest filter function for snippets based on a cursor position
   *
   * @param {object} - cursor position
   *
   * @returns {function} - filter function for selection proper snippets based
   *  on provided position
  */
  function filterForSnippets(path) {
    return function filter(snippet) {
      return isMatchPath(path, snippet.path);
    };
  }

  /*
   * With a given object returns the child that it's key matches provided key
   *
   * @param {object} object - the object to look into
   * @param {key} - the key used for lookup
   *
   * @returns {object} - the object that is matched
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
   * Gets array of keywords based on a position
   *
   * @param {object} pos - the position to get keywords from
   *
   * @returns {Promise<array>} - list of keywords for provided position
  */
  function getKeywordsForPosition(pos) {
    var keywordsMap = KeywordMap.get();

    return getPathForPosition(pos).then(function (path) {
      var key = path.shift();

      // is getting path was not successful stop here and return no candidates
      if (!_.isArray(path)) {
        return [];
      }

      // traverse down the keywordsMap for each key in the path until there is
      // no key in the path
      while (key && _.isObject(keywordsMap)) {
        keywordsMap = getChild(keywordsMap, key);
        key = path.shift();
      }

      // if no keywordsMap was found after the traversal return no candidates
      if (!_.isObject(keywordsMap)) {
        return [];
      }

      // If keywordsMap is describing an array unwrap the inner map so we can
      // suggest for array items
      if (_.isArray(keywordsMap)) {
        keywordsMap = keywordsMap[0];
      }

      // if keywordsMap is not an object at this point return no candidates
      if (!_.isObject(keywordsMap)) {
        return [];
      }

      // for each key in keywordsMap map construct a completion candidate and
      // return the array
      return _.keys(keywordsMap).map(constructAceCompletion);
    });
  }

  /*
   * Constructs an Ace compatible completion candidate from a keyword
   *
   * @param {string} keyword
   *
   * @returns {object} - Ace compatible completion candidate
  */
  function constructAceCompletion(keyword) {
    return {
      name: keyword,
      value: keyword,
      score: 300,
      meta: 'keyword'
    };
  }

  /*
   * Gets array of snippets based on a position
   *
   * @param {object} pos - the position to get snippets from
   *
   * @returns {Promise<array>} - list of snippets for provided position
  */
  function getSnippetsForPosition(pos) {

    return getPathForPosition(pos).then(function (path) {

      // find all possible snippets, modify them to be compatible with Ace and
      // sort them based on their position. Sorting is done by assigning a score
      // to each snippet, not by sorting the array
      return snippets
        .filter(filterForSnippets(path))
        .map(constructAceSnippet)
        .map(snippetSorterForPos(path));
    });
  }

  /*
   * Returns a function that gives score to snippet based on their position
   *
   * Note: not fully implemented method
   *
   * @param {object} position - current cursor position
   *
   * @returns {function} - applies snippet with score based on position
  */
  function snippetSorterForPos(path) {

    // this function is used in Array#map
    return function sortSnippets(snippet) {

      // by default score is high
      var score = 1000;

      // if snippets content has the keyword it will get a lower score because
      // it's more likely less relevant
      // FIXME: is this logic work for all cases?
      path.forEach(function (keyword) {
        if (snippet.snippet.indexOf(keyword)) {
          score = 500;
        }
      });

      snippet.score = score;

      return snippet;
    };
  }
});
