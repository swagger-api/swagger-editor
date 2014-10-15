'use strict';

PhonicsApp.service('Editor', function Editor() {
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

    ace.config.set('basePath', '/bower_components/ace-builds/src-noconflict');

    // Set editor options
    editor.setOptions({
      fontFamily: 'Source Code Pro',
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true
    });

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

  function onChangeFold() {
    var args = arguments;
    changeFoldFns.forEach(function (fn) {
      fn.apply(editor, args);
    });
  }

  function configureSession(session) {
    session.setTabSize(2);
  }

  function setValue(value) {
    if (angular.isString(value) && editor) {
      editor.getSession().setValue(value);
    }

    // If it's an object, convert it YAML
    if (angular.isObject(value)) {
      setValue(jsyaml.dump(angular.copy(value)));
    }
  }

  function getValue() {
    if (editor) {
      return editor.getSession().getValue();
    }
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

  this.getValue = getValue;
  this.setValue = setValue;
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
});
