'use strict';

PhonicsApp.service('Autocomplete', function Autocomplete(snippets) {
  var langTools = ace.require('ace/ext/language_tools');
  var snippetManager = ace.require('ace/snippets').snippetManager;
  var editor = null;

  function enableStringMode() {
    if (!editor) { return; }

    editor.completers = [
      ASTCompleter,
      langTools.keyWordCompleter,
      langTools.textCompleter,
      langTools.snippetCompleter
    ];
  }

  function disableStringMode() {
    if (!editor) { return; }

    editor.completers = [ASTCompleter];
  }

  // debug
  window.enab = enableStringMode;
  window.disab = disableStringMode;

  var ASTCompleter = {
    getCompletions: function (editor, session, pos, prefix, callback) {
      callback(null, [
        {'name':'flow', 'value':'fooooe', 'score':300, 'meta':'swagger'},
        {'name':'moor', 'value':'loooos', 'score':300, 'meta':'swagger'}
      ]);
    }
  };

  this.init = function(e) {
    editor = e;
    langTools.addCompleter(ASTCompleter);
    snippetManager.register(snippets, 'yaml');
  };
});
