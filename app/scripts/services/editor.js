'use strict';

PhonicsApp.service('Editor', ['$localStorage', 'Builder', 'Validator',
  function Editor($localStorage, Builder, Validator) {
    var editor = null;

    function saveToLocalStorage(value){
      _.debounce(function(){
        window.requestAnimationFrame(function(){
          $localStorage.yamlCache = value;
        });
      },500);
    }

    function initializeEditor(){
      $(document).on('pane-resize', editor.resize.bind(editor));
      if($localStorage.yamlCache){
        setValue($localStorage.yamlCache);
        Builder.buildDocs($localStorage.yamlCache);
      } else {
        // TODO
        // $scope.resetSpec();
      }
    }


    function annotateYAMLErrors(){
      var value = editor.getSession().getValue();
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
      editor = e;
      initializeEditor(editor);
    }

    function setValue(value){
      editor.getSession().setValue(value);
    }

    function aceChanged(){
      var value = editor.getSession().getValue();
      saveToLocalStorage(value);

      annotateYAMLErrors();
      Builder.buildDocs(value);
    }

    this.setValue = setValue;
    this.aceLoaded = aceLoaded;
    this.aceChanged = aceChanged;
    this.initializeEditor = initializeEditor;
    this.aceChanged = aceLoaded;
  }
]);
