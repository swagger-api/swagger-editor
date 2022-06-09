import * as monaco from 'monaco-editor-core';
import { ProtocolToMonacoConverter } from 'monaco-languageclient/monaco-converter';

import { languageId } from '../config.js';

export default class DiagnosticsAdapter {
  #worker;

  #p2m = new ProtocolToMonacoConverter(monaco);

  #listener = [];

  #disposables = [];

  constructor(worker) {
    this.#worker = worker;

    const onModelAdd = (model) => {
      if (model.getLanguageId() !== languageId) {
        return;
      }

      let handle;
      const changeSubscription = model.onDidChangeContent(() => {
        /**
         * Here we are Debouncing the user changes, so everytime a new change is done,
         * we wait some time before validating, otherwise if the user is still typing, we cancel the change.
         */
        clearTimeout(handle);
        handle = setTimeout(() => this.#validate(model), 300);
      });

      this.#listener[model.uri.toString()] = {
        dispose() {
          changeSubscription.dispose();
          clearTimeout(handle);
        },
      };

      this.#validate(model);
    };

    const onModelRemoved = (model) => {
      monaco.editor.setModelMarkers(model, languageId, []);
      const key = model.uri.toString();
      if (this.#listener[key]) {
        this.#listener[key].dispose();
        delete this.#listener[key];
      }
    };

    this.#disposables.push(monaco.editor.onDidCreateModel(onModelAdd));
    this.#disposables.push(monaco.editor.onWillDisposeModel(onModelRemoved));
    // Monaco supports multiple models, though we only use a single model
    monaco.editor.getModels().forEach(onModelAdd);
  }

  async #getErrorMarkers(model) {
    const worker = await this.#worker(model.uri);
    const error = { error: 'unable to doValidation' };

    if (model.isDisposed()) {
      // model was disposed in the meantime
      return error;
    }

    try {
      const errorMarkers = await worker.doValidation(model.uri);

      return errorMarkers ?? error;
    } catch {
      return error;
    }
  }

  #maybeConvert(model, errorMarkers) {
    if (typeof errorMarkers?.error === 'string') {
      return errorMarkers;
    }

    const markerData = this.#p2m.asDiagnostics(errorMarkers);
    monaco.editor.setModelMarkers(model, languageId, markerData);
    return { message: 'doValidation success' };
  }

  async #validate(model) {
    const errorMarkers = await this.#getErrorMarkers(model);

    return this.#maybeConvert(model, errorMarkers);
  }

  dispose() {
    this.#disposables.forEach((disposable) => disposable?.dispose());
    this.#disposables = [];
  }
}
