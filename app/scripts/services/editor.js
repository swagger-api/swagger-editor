'use strict';

PhonicsApp.service('Editor', ['$localStorage', 'Validator', 'Storage', 'Builder', Editor]);

function Editor($localStorage, Validator, Storage, Builder) {
  var editor = null;
  var onReadyFns = [];
  var that = this;


  function annotateYAMLErrors(error){

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

    // Editor is ready, fire the on-ready function and flush the queue
    onReadyFns.forEach(function (fn) {
      fn(that);
    });
    onReadyFns = [];
  }

  function setValue(value){
    if (typeof value === 'string') {
      editor.getSession().setValue(value);
    }

    // If it's an object, convert it YAML
    if (typeof value === 'object') {
      setValue(jsyaml.dump(value));
    }
  }

  function getValue(){
    return editor.getSession().getValue();
  }

  function aceChanged(){
    var value = getValue();
    var error = Validator.validateYamlString(value);

    annotateYAMLErrors(error && error.yamlError);

    var specs = Builder.buildDocs(value);

    Storage.save(specs);
  }

  function resize(){
    editor.resize();
  }

  function ready(fn) {
    if(typeof fn === 'function'){
      onReadyFns.push(fn);
    }
  }

  this.setValue = setValue;
  this.aceLoaded = aceLoaded;
  this.aceChanged = aceChanged;
  this.resize = resize;
  this.ready = ready;
}
