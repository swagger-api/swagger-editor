import * as monaco from 'monaco-editor-core';

import { languageID } from './config';

function toDiagnostics(error) {
  return {
    ...error,
    severity: monaco.MarkerSeverity.Error,
  };
}

export default class DiagnosticsAdapter {
  constructor(worker) {
    this.worker = worker;
    const onModelAdd = (model) => {
      let handle;
      model.onDidChangeContent(() => {
        // here we are Debouncing the user changes, so everytime a new change is done, we wait 500ms before validating
        // otherwise if the user is still typing, we cancel the change
        clearTimeout(handle);
        handle = setTimeout(() => this.validate(model.uri), 500);
      });

      this.validate(model.uri);
    };
    monaco.editor.onDidCreateModel(onModelAdd);
    monaco.editor.getModels().forEach(onModelAdd);
  }

  // intended private
  async validate(resource) {
    // get the worker proxy (ts interface)
    const worker = await this.worker(resource);
    console.log('diagnostics. worker:', worker);
    // call the validate methode proxy from the langauge service and get errors
    const errorMarkers = await worker.doValidation(resource);
    // get the current model(editor or file) which is only one
    const model = monaco.editor.getModel(resource);
    // add the error markers and underline them with severity of Error
    monaco.editor.setModelMarkers(model, languageID, errorMarkers.map(toDiagnostics));
  }
}
