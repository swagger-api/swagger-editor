'use strict';

PhonicsApp.service('Editor', ['$localStorage', 'Builder', function Editor($localStorage, Builder) {
  var editor = null;

  function saveToLocalStorage(value){
    _.debounce(function(){
      window.requestAnimationFrame(function(){
        $localStorage.cache = value;
      });
    },500);
  }

  function initializeEditor(){
    $(document).on('pane-resize', editor.resize.bind(editor));
    if($localStorage.cache){
      setValue($localStorage.cache);
      Builder.buildDocs($localStorage.cache);
    } else {
      // TODO
      // $scope.resetSpec();
    }
  }


  function annotateYAMLErrors(){
    var errorMessage = null;
    var value = editor.getSession().getValue();
    try {
      jsyaml.load(value);
    } catch(yamlLoadError) {
      errorMessage = yamlLoadError.message.replace('JS-YAML: ', '');
      editor.getSession().setAnnotations([{
        row: yamlLoadError.mark.line,
        column: yamlLoadError.mark.column,
        text: errorMessage,
        type: 'error'
      }]);
      return errorMessage;
    }
    editor.getSession().clearAnnotations();
    return errorMessage;
  }


  function aceLoaded(e) {
    editor = e;
    initializeEditor(editor);
  }

  function setValue(value){
    editor.getSession().setValue(value);
  }

  function aceChanged(){
    $scope.invalidDocs = false;
    $scope.emptyDocs = false;
    var error = null;
    var value = editor.getSession().getValue();
    saveToLocalStorage(value);
    if(!value){
      $scope.emptyDocs = true;
      return;
    }

    error = Editor.annotateYAMLErrors(editor);
    if(error) {
      $scope.invalidDocs = true;
      return;
    }else{
      $scope.editorErrorMessage = '';
    }
    Builder.buildDocs($scope, editor.getSession().getValue());
  }

  this.setValue = setValue;
  this.aceLoaded = aceLoaded;
  this.initializeEditor = initializeEditor;
  this.annotateYAMLErrors = annotateYAMLErrors;
  this.aceChanged = aceLoaded;
}]);
