import * as monaco from 'monaco-editor-core';
import { ProtocolToMonacoConverter } from 'monaco-languageclient/lib/monaco-converter.js';

import { languageID } from './config.js';

export default class DiagnosticsAdapter {
  constructor(worker) {
    this.worker = worker;
    const onModelAdd = (model) => {
      let handle;
      model.onDidChangeContent(() => {
        // here we are Debouncing the user changes, so everytime a new change is done, we wait 500ms before validating
        // otherwise if the user is still typing, we cancel the change
        clearTimeout(handle);
        handle = setTimeout(() => this.validate(model.uri), 300);
      });

      this.validate(model.uri);
    };
    monaco.editor.onDidCreateModel(onModelAdd);
    // Monaco supports multiple models, though we only use a single model
    monaco.editor.getModels().forEach(onModelAdd);
  }

  // intended private
  async validate(resource) {
    // get the worker proxy (ts interface)
    const worker = await this.worker(resource);
    // call the validate methode proxy from the language service and get errors
    try {
      const errorMarkers = await worker.doValidation(resource);
      if (!errorMarkers) {
        return Promise.resolve({ error: 'unable to doValidation' });
      }
      // get the current model (editor or file)
      const model = monaco.editor.getModel(resource);
      // generate model markers to set in editor
      const p2m = new ProtocolToMonacoConverter(monaco);
      const markers = p2m.asDiagnostics(errorMarkers);
      monaco.editor.setModelMarkers(model, languageID, markers);
      return Promise.resolve({ message: 'doValidation success' });
    } catch (e) {
      return Promise.resolve({ error: 'unable to doValidation' });
    }
  }
}
