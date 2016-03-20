'use strict';

var ace = require('brace');

require('brace/theme/ambiance');
require('brace/theme/chaos');
require('brace/theme/chrome');
require('brace/theme/clouds');
require('brace/theme/clouds_midnight');
require('brace/theme/cobalt');
require('brace/theme/crimson_editor');
require('brace/theme/dawn');
require('brace/theme/dreamweaver');
require('brace/theme/eclipse');
require('brace/theme/github');
require('brace/theme/idle_fingers');
require('brace/theme/iplastic');
require('brace/theme/katzenmilch');
require('brace/theme/kr_theme');
require('brace/theme/kuroir');
require('brace/theme/merbivore');
require('brace/theme/merbivore_soft');
require('brace/theme/mono_industrial');
require('brace/theme/monokai');
require('brace/theme/pastel_on_dark');
require('brace/theme/solarized_dark');
require('brace/theme/solarized_light');
require('brace/theme/sqlserver');
require('brace/theme/terminal');
require('brace/theme/textmate');
require('brace/theme/tomorrow');
require('brace/theme/tomorrow_night');
require('brace/theme/tomorrow_night_blue');
require('brace/theme/tomorrow_night_bright');
require('brace/theme/tomorrow_night_eighties');
require('brace/theme/twilight');
require('brace/theme/vibrant_ink');
require('brace/theme/xcode');

require('brace/keybinding/emacs');
require('brace/keybinding/vim');

require('brace/mode/yaml');

// after requiring mode/yaml Ace will look for snippets/yaml.
// this empty module defined here makes Ace think that module exists.
window.ace.define('ace/snippets/yaml', [], function () {});

require('brace/mode/snippets');
require('brace/ext/language_tools');
require('brace/ext/keybinding_menu');
require('brace/ext/settings_menu');

require('../ace/themes/theme-atom_dark.js');

SwaggerEditor.service('Editor', function Editor(Autocomplete, ASTManager,
  LocalStorage, defaults, $interval) {
  var editor = null;
  var onReadyFns = new Set();
  var changeFoldFns = new Set();
  var that = this;
  var editorOptions = defaults.editorOptions || {};
  var defaultTheme = editorOptions.theme || 'ace/theme/atom_dark';

  function annotateYAMLErrors(error) {
    if (editor && error && error.mark && error.reason) {
      editor.getSession().setAnnotations([{
        row: error.mark.line,
        column: error.mark.column,
        text: error.reason,
        type: 'error'
      }]);
    }
  }

  function annotateSwaggerError(error, type) {
    var row = 0;
    var column = 0;

    if (false && editor && error.path) {
      if (error.path.length) {
        // TODO: ASTManager
        row = ASTManager.lineForPath(_.cloneDeep(error.path));
      }
      editor.getSession().setAnnotations([{
        row: row,
        column: column,
        text: error.message,
        type: type || 'error'
      }]);
    }
  }

  function clearAnnotation() {
    editor.getSession().clearAnnotations();
  }

  function aceLoaded(e) {

    editor = e;
    editor.$blockScrolling = Infinity;

    Autocomplete.init(e);

    // Set editor options
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true
    });

    loadEditorSettings();

    // Editor is ready, fire the on-ready function and flush the queue
    onReadyFns.forEach(function (fn) {
      fn(that);
    });
    onReadyFns = new Set();

    var session = editor.getSession();

    // Hookup changeFold listeners
    session.on('changeFold', onChangeFold);

    configureSession(session);
  }

  function saveEditorSettings() {
    if (editor) {
      LocalStorage.save('editor-settings', editor.getOptions());
    }
  }

  function loadEditorSettings() {
    if (editor) {
      LocalStorage.load('editor-settings').then(function (options) {
        options = options || {theme: defaultTheme};
        editor.setOptions(options);
      });
    }
  }

  function onChangeFold(event) {
    changeFoldFns.forEach(function (fn) {
      fn.call(null, event);
    });
  }

  function configureSession(session) {
    session.setTabSize(2);
  }

  function ready(fn) {
    if (angular.isFunction(fn)) {
      onReadyFns.add(fn);
    }
  }

  function getAllFolds() {
    var session = editor.getSession();
    var folds = null;

    session.foldAll();
    folds = session.unfold();

    return Array.isArray(folds) ? folds : [];
  }

  function getLine(l) {
    return editor.session.getLine(l);
  }

  function onFoldChanged(fn) {
    if (_.isFunction(fn)) {
      changeFoldFns.add(fn);
    }
  }

  function addFold(start, end) {
    if (editor) {
      editor.getSession().foldAll(start, end);
    }
  }

  function removeFold(start, end) {
    if (editor) {
      editor.getSession().unfold(editor.getSession().getFoldAt(start, end));
    }
  }

  function gotoLine(line) {
    editor.gotoLine(line);
  }

  function lineInFocus() {
    if (!editor) {
      return null;
    }
    return editor.getCursorPosition().row;
  }

  function showSettings() {
    ace.config.loadModule('ace/ext/settings_menu', function (module) {
      module.init(editor);
      editor.showSettingsMenu();

      // Crazy hack to get around Ace not notifying us when settings changes
      // Related bug in Ace:
      // https://github.com/ajaxorg/ace/issues/2250
      var checkInterval = $interval(function () {
        if ($('#ace_settingsmenu').length === 0) {
          saveEditorSettings();
          $interval.cancel(checkInterval);
          checkInterval = undefined;
        }
      }, 300);
    });
  }

  function resetSettings() {
    if (window.confirm('Are you sure?') && editor) {
      editor.setOptions(editorOptions);
      saveEditorSettings();
    }
  }

  function adjustFontSize(by) {
    if (editor) {
      var fontSize = parseInt(editor.getOption('fontSize'), 10);
      editor.setOption('fontSize', fontSize + by);
      saveEditorSettings();
    }
  }

  /*
   * Focus editor to enable it for typing
  */
  function focus() {
    if (editor) {
      editor.focus();
    }
  }

  this.aceLoaded = aceLoaded;
  this.ready = ready;
  this.annotateYAMLErrors = annotateYAMLErrors;
  this.annotateSwaggerError = annotateSwaggerError;
  this.clearAnnotation = clearAnnotation;
  this.getAllFolds = getAllFolds;
  this.getLine = getLine;
  this.onFoldChanged = onFoldChanged;
  this.addFold = addFold;
  this.removeFold = removeFold;
  this.gotoLine = gotoLine;
  this.lineInFocus = lineInFocus;
  this.showSettings = showSettings;
  this.saveEditorSettings = saveEditorSettings;
  this.adjustFontSize = adjustFontSize;
  this.resetSettings = resetSettings;
  this.focus = focus;
});
