'use strict';

PhonicsApp.value('editorHelper', {
  annotateYAMLErrors: function annotateYAMLErrors(editor){
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
});
