'use strict';

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

    // Assign class variable `editor`
    window.e = editor = e;

    ace.config.set('basePath', 'bower_components/ace-builds/src-noconflict');

    Autocomplete.init(e);
    // Set editor options
    editor.setOptions({
      fontFamily: 'Source Code Pro',
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
