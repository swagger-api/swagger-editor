'use strict';

var ace = require('brace');
var _ = require('lodash');
var angular = require('angular');
var $ = require('jquery');

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
window.ace.define('ace/snippets/yaml', [], function() {});

require('brace/mode/snippets');
require('brace/ext/language_tools');
require('brace/ext/keybinding_menu');
require('brace/ext/settings_menu');
require('brace/ext/searchbox');

require('scripts/ace/themes/theme-atom_dark.js');

SwaggerEditor.service('Editor', function Editor(Autocomplete, ASTManager,
  LocalStorage, defaults, $interval) {
  var editor = null;
  var onReadyFns = new Set();
  var changeFoldFns = new Set();
  var that = this;
  var editorOptions = defaults.editorOptions || {};
  var defaultTheme = editorOptions.theme || 'ace/theme/atom_dark';

  /**
   * Annotate editor
   *
   * @description
   * Editor's lines and columns are 0-indexed but most errors are
   * 1-indexed. Therefore we're substracting 1
   *
   * @param {number} row - Row (0 index)
   * @param {number} column - Column (0 index)
   * @param {string} message - Error or warning
   * @param {string} type - "error" or "warning"
  */
  function annotate(row, column, message, type) {
    if (!editor) {
      return;
    }

    var session = editor.getSession();
    var annotatations = session.getAnnotations();

    session.setAnnotations(annotatations.concat([{
      row: row - 1,
      column: column - 1,
      text: message,
      type: type
    }]));
  }

  var annotateYAMLErrors = function(error) {
    if (editor && error && error.mark && error.reason) {
      annotate(error.mark.line, error.mark.column, error.reason, 'error');
    }
  };

  var annotateSwaggerError = function(error, type) {
    var value = editor.getValue();

    if (value && editor && error.path && error.path.length) {
      ASTManager.positionRangeForPath(value, _.cloneDeep(error.path))
        .then(function(position) {
          annotate(
            position.start.line,
            position.start.column,
            error.message,
            type || 'error'
          );
        });
    }
  };

  var clearAnnotation = function() {
    editor.getSession().clearAnnotations();
  };

  var aceLoaded = function(e) {
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
    onReadyFns.forEach(function(fn) {
      fn(that);
    });
    onReadyFns = new Set();

    var session = editor.getSession();

    // Hookup changeFold listeners
    session.on('changeFold', onChangeFold);

    configureSession(session);
  };

  var saveEditorSettings = function() {
    if (editor) {
      LocalStorage.save('editor-settings', editor.getOptions());
    }
  };
  /** */
  function loadEditorSettings() {
    if (editor) {
      LocalStorage.load('editor-settings').then(function(options) {
        options = options || {theme: defaultTheme};
        editor.setOptions(options);
      });
    }
  }

  /**
   * @param {array} event - event
  */
  function onChangeFold(event) {
    changeFoldFns.forEach(function(fn) {
      fn(event);
    });
  }

  /**
   * @param {object} session - session
  */
  function configureSession(session) {
    session.setTabSize(2);
  }

  /**
   * @param {function} fn - function
  */
  function ready(fn) {
    if (angular.isFunction(fn)) {
      onReadyFns.add(fn);
    }
  }

  /**
   * @return {array} assigns an array to folds
  */
  function getAllFolds() {
    var session = editor.getSession();
    var folds = null;

    session.foldAll();
    folds = session.unfold();

    return Array.isArray(folds) ? folds : [];
  }

  /**
   * @param {int} l - line number
   * @return {string} returns the line
  */
  function getLine(l) {
    return editor.session.getLine(l);
  }

  /**
   * @param {function} fn - function
  */
  function onFoldChanged(fn) {
    if (_.isFunction(fn)) {
      changeFoldFns.add(fn);
    }
  }

  /**
   * @param {int} start - folding starts from here
   * @param {int} end - folding finishes here
  */
  function addFold(start, end) {
    if (editor) {
      editor.getSession().foldAll(start, end);
    }
  }

  /**
   * @param {int} start - folding starts from here
   * @param {int} end - folding finishes here
  */
  function removeFold(start, end) {
    if (editor) {
      editor.getSession().unfold(editor.getSession().getFoldAt(start, end));
    }
  }

  /**
   * @param {int} line - line number
  */
  function gotoLine(line) {
    editor.gotoLine(line);
  }

  /**
   * @return {int} line that has the cursor
  */
  function lineInFocus() {
    if (!editor) {
      return null;
    }
    return editor.getCursorPosition().row;
  }

  /** */
  function showSettings() {
    ace.config.loadModule('ace/ext/settings_menu', function(module) {
      module.init(editor);
      editor.showSettingsMenu();

      // Crazy hack to get around Ace not notifying us when settings changes
      // Related bug in Ace:
      // https://github.com/ajaxorg/ace/issues/2250
      var checkInterval = $interval(function() {
        if ($('#ace_settingsmenu').length === 0) {
          saveEditorSettings();
          $interval.cancel(checkInterval);
          checkInterval = undefined;
        }
      }, 300);
    });
  }

  /** */
  function resetSettings() {
    if (editor) {
      editor.setOptions(editorOptions);
      saveEditorSettings();
    }
  }

  /**
   * @param {int} by - integer
  */
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
  var focus = function() {
    if (editor) {
      editor.focus();
    }
  };

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
