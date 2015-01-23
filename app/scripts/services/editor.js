'use strict';

SwaggerEditor.service('Editor', function Editor(Autocomplete, ASTManager,
  LocalStorage, $interval) {
  var editor = null;
  var onReadyFns = [];
  var changeFoldFns = [];
  var that = this;

  function annotateYAMLErrors(error) {
    if (error && error.mark && error.reason) {
      editor.getSession().setAnnotations([{
        row: error.mark.line,
        column: error.mark.column,
        text: error.reason,
        type: 'error'
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

    ASTManager.refresh(editor.getValue());
    onFoldChanged(ASTManager.onFoldChanged);

    // Editor is ready, fire the on-ready function and flush the queue
    onReadyFns.forEach(function (fn) {
      fn(that);
    });
    onReadyFns = [];

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
        if (!options) {
          editor.setOption('theme', 'ace/theme/atom_dark');
        } else {
          editor.setOptions(options);
        }
      });
    }
  }

  function onChangeFold() {
    var args = arguments;
    changeFoldFns.forEach(function (fn) {
      fn.apply(editor, args);
    });
  }

  function configureSession(session) {
    session.setTabSize(2);
  }

  function resize() {
    editor.resize();
  }

  function ready(fn) {
    if (angular.isFunction(fn)) {
      onReadyFns.push(fn);
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
    changeFoldFns.push(fn);
  }

  function addFold(start, end) {
    if (editor) {
      editor.getSession().foldAll(start, end);
    }
  }

  function removeFold(start) {
    // TODO: Depth of unfolding is hard-coded to 100 but we need
    // to have depth as a parameter and/or having smarter way of
    // handling subfolds
    if (editor) {
      editor.getSession().unfold(start, 100);
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
    var defaultOptions = {
      selectionStyle: 'line',
      highlightActiveLine: true,
      highlightSelectedWord: true,
      readOnly: false,
      cursorStyle: 'ace',
      mergeUndoDeltas: true,
      behavioursEnabled: true,
      wrapBehavioursEnabled: true,
      hScrollBarAlwaysVisible: false,
      vScrollBarAlwaysVisible: false,
      highlightGutterLine: true,
      animatedScroll: false,
      showInvisibles: false,
      showPrintMargin: true,
      printMarginColumn: 80,
      printMargin: 80,
      fadeFoldWidgets: false,
      showFoldWidgets: true,
      showLineNumbers: true,
      showGutter: true,
      displayIndentGuides: true,
      fontSize: 12,
      fontFamily: 'Source Code Pro',
      scrollPastEnd: 0,
      theme: 'ace/theme/atom_dark',
      scrollSpeed: 2,
      dragDelay: 150,
      dragEnabled: true,
      focusTimout: 0,
      tooltipFollowsMouse: true,
      firstLineNumber: 1,
      overwrite: false,
      newLineMode: 'auto',
      useWorker: true,
      useSoftTabs: true,
      tabSize: 2,
      wrap: 'free',
      mode: 'ace/mode/yaml',
      enableMultiselect: true,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true
    };
    if (window.confirm('Are you sure?') && editor) {
      editor.setOptions(defaultOptions);
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
  this.resize = resize;
  this.ready = ready;
  this.annotateYAMLErrors = annotateYAMLErrors;
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
