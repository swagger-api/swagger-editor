/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
// import * as monaco from 'monaco-editor-core'; // TS interface
// import { TextDocument } from 'vscode-languageserver-textdocument'; // this is true source
import { getLanguageService } from 'vscode-json-languageservice'; // will eventually come from apidom
// import { CompletionContext, getLanguageService, LanguageServiceContext } from "../../../apidom/packages/apidom-ls";

// import TodoLangLanguageService from "../language-service/LanguageService";
// import { ITodoLangError } from "../language-service/TodoLangErrorListener";

export class ApidomWorker {
  // eslint-disable-next-line no-unused-vars
  constructor(ctx, createData) {
    this._ctx = ctx;
    // define this._x for languageSettings, languageId, languageService
    this._languageService = getLanguageService();
    // this._languageService.configure(this._languageSettings);
  }

  async doValidation(uri) {
    const document = this._getTextDocument(uri); // call a private method
    if (document) {
      // note: in cssWorker example, doValidation(document, parsedStylesheet)
      const diagnostics = this._languageService.doValidation(document);
      console.log('doValidation... diagnostics:', diagnostics);
      return Promise.resolve(diagnostics);
    }
    return Promise.resolve([]);
  }

  // intended as private method
  // eslint-disable-next-line no-unused-vars
  static _getTextDocument(uri) {
    const models = this._ctx.getMirrorModels()[0]; // When there are multiple files open, this will be an array
    // fyi, reference more complete example in cssWorker
    // https://github.com/microsoft/monaco-css/blob/master/src/cssWorker.ts
    // which we might want later to handle multiple URIs
    // expect return a TextDocument/TextDocument.create()
    return models.getValue();
  }
}

export function create(ctx, createData) {
  return new ApidomWorker(ctx, createData);
}
