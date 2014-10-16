'use strict';

PhonicsApp.service('Autocomplete', function Autocomplete(snippets) {
  var langTools = ace.require('ace/ext/language_tools');
  var snippetManager = ace.require('ace/snippets').snippetManager;
  var editor = null;

  var ASTCompleter = {
    getCompletions: function (editor, session, pos, prefix, callback) {
      var showSnippets = true;

      editor.completer.autoSelect = true;
      editor.completer.autoInsert = true;

      if (showSnippets) {
        langTools.snippetCompleter.getCompletions
          .apply(langTools.snippetCompleter.getCompletions, arguments);
      }

      callback(null, [
        {name: 'flow', value: 'fooooe', score: 300, meta: 'swagger'},
        {name: 'moor', value: 'loooos', score: 300, meta: 'swagger'}
      ]);
    }
  };

  this.init = function (e) {
    editor = e;
    snippetManager.register(snippets, 'yaml');
    editor.completers = [ASTCompleter];
  };
});
