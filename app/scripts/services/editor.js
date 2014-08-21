'use strict';

PhonicsApp.service('Editor', [Editor]);

function Editor() {
  var editor = null;
  var onReadyFns = [];
  var changeFoldFns = [];
  var that = this;

  function annotateYAMLErrors(error) {

    if (error) {
      editor.getSession().setAnnotations([{
        row: error.row,
        column: error.column,
        text: error.message,
        type: 'error'
      }]);
    } else {
      editor.getSession().clearAnnotations();
    }
  }

  function aceLoaded(e) {

    // Assign class variable `editor`
    editor = e;

    window.e = e;

    // Editor is ready, fire the on-ready function and flush the queue
    onReadyFns.forEach(function (fn) {
      fn(that);
    });
    onReadyFns = [];

    // Hookup changeFold listeners
    editor.getSession().on('changeFold', onChangeFold);
  }

  function onChangeFold() {
    var args = arguments;
    changeFoldFns.forEach(function (fn) {
      fn.apply(editor, args);
    });
  }

  function setValue(value) {
    if (typeof value === 'string') {
      editor.getSession().setValue(value);
    }

    // If it's an object, convert it YAML
    if (typeof value === 'object') {
      setValue(jsyaml.dump(angular.copy(value)));
    }
  }

  function getValue() {
    return editor.getSession().getValue();
  }

  function resize() {
    editor.resize();
  }

  function ready(fn) {
    if (typeof fn === 'function') {
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

  function addFold(fold) {
    editor.getSession().addFold(fold);
  }

  function removeFold(fold) {
    editor.getSession().removeFold(fold);
  }

  this.getValue = getValue;
  this.setValue = setValue;
  this.aceLoaded = aceLoaded;
  this.resize = resize;
  this.ready = ready;
  this.annotateYAMLErrors = annotateYAMLErrors;
  this.getAllFolds = getAllFolds;
  this.getLine = getLine;
  this.onFoldChanged = onFoldChanged;
  this.addFold = addFold;
  this.removeFold = removeFold;
}
