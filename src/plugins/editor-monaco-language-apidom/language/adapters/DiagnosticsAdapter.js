import * as monaco from 'monaco-editor';
import { languages } from 'vscode';

import Adapter from './Adapter.js';
import { languageId } from '../config.js';

export default class DiagnosticsAdapter extends Adapter {
  #listener = [];

  #disposables = [];

  #diagnosticCollection;

  constructor(...args) {
    super(...args);

    this.#diagnosticCollection = languages.createDiagnosticCollection(languageId);

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
      this.#diagnosticCollection.set(model.uri, []);
      const key = model.uri.toString();
      if (this.#listener[key]) {
        this.#listener[key].dispose();
        delete this.#listener[key];
      }
    };

    this.#disposables.push(monaco.editor.onDidCreateModel(onModelAdd));
    this.#disposables.push(monaco.editor.onWillDisposeModel(onModelRemoved));
    this.#disposables.push(this.#diagnosticCollection);
    // Monaco supports multiple models, though we only use a single model
    monaco.editor.getModels().forEach(onModelAdd);
  }

  async #getDiagnostics(model) {
    const worker = await this.worker(model.uri);

    if (model.isDisposed()) {
      // model was disposed in the meantime
      return undefined;
    }

    try {
      return await worker.doValidation(model.uri);
    } catch {
      return undefined;
    }
  }

  async #validate(model) {
    const diagnostics = await this.#getDiagnostics(model);

    this.#diagnosticCollection.set(
      model.uri,
      await this.protocolConverter.asDiagnostics(diagnostics)
    );
  }

  dispose() {
    super.dispose();
    this.#disposables.forEach((disposable) => disposable?.dispose());
    this.#disposables = [];
  }
}
