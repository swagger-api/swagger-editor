'use strict';

PhonicsApp.service('Editor', ['$localStorage', 'Builder', 'Validator',
  function Editor($localStorage, Builder, Validator) {
    var editor = null;
    var onReadyFns = [];
    var that = this;

    function saveToLocalStorage(value){
      _.debounce(function() {
        window.requestAnimationFrame(function(){
          $localStorage.yamlCache = value;
        });
      }, 500);
    }



    function annotateYAMLErrors(){
      var value = getValue();
      var error = Validator.checkYamlString(value);

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

      // Editor is ready
      onReadyFns.forEach(function (fn) {
        fn(that);
      });
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
      return getValue();
    }

    function aceChanged(){
      var value = getValue();
      saveToLocalStorage(value);

      annotateYAMLErrors();
      Builder.buildDocs(value);
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
    this.aceChanged = aceLoaded;
    this.resize = resize;
    this.ready = ready;
  }
]);
