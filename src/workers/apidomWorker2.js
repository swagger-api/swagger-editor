/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
// import * as monaco from 'monaco-editor-core'; // TS interface
import { TextDocument } from 'vscode-languageserver-textdocument'; // this is true source
import { getLanguageService } from 'vscode-json-languageservice'; // will eventually come from apidom
// import {
//   // eslint-disable-next-line no-unused-vars
//   CompletionContext,
//   getLanguageService,
//   // eslint-disable-next-line no-unused-vars
//   LanguageServiceContext,
// } from 'apidom-ls';

import { languageID } from '../utils/samples/config';
// import TodoLangLanguageService from "../language-service/LanguageService";
// import { ITodoLangError } from "../language-service/TodoLangErrorListener";

export class ApidomWorker {
  // eslint-disable-next-line no-unused-vars
  constructor(ctx, createData) {
    this._ctx = ctx;
    // define this._x for languageSettings, languageId, languageService
    this._languageService = getLanguageService(this._ctx);
    // this._languageService.configure(this._languageSettings);
  }

  async doValidation(uri) {
    const document = this._getTextDocument(uri); // call a private method
    // console.log('inside worker. document:', document); // ok
    if (document) {
      // note: in cssWorker example, doValidation(document, parsedStylesheet)
      // const jsonDocument = this._languageService.parseJSONDocument(document);
      // console.log('doValidation... jsonDocument', jsonDocument);
      const diagnostics = await this._languageService.doValidation(document);
      console.log('doValidation... diagnostics:', diagnostics); // pending Promise
      // const finish = Promise.resolve(diagnostics);
      // console.log('doValidation... finish:', finish);
      return Promise.resolve(diagnostics);
    }
    return Promise.resolve([]);
  }

  // intended as private method
  // eslint-disable-next-line no-unused-vars
  _getTextDocument(uri) {
    // console.log('_getTextDocument... args: uri', uri);
    const models = this._ctx.getMirrorModels()[0]; // When there are multiple files open, this will be an array
    console.log('_getTextDocument.models', models);
    // models: _lines[], _uri, _versionId
    // fyi, reference more complete example in cssWorker
    // https://github.com/microsoft/monaco-css/blob/master/src/cssWorker.ts
    // which we might want later to handle multiple URIs
    // expect return a TextDocument/TextDocument.create()
    // const testModelsUri = models.uri.toString(); // singular
    // console.log('testModelsUri:', testModelsUri); // inmemory://model/1
    // if (models.uri.toString() === uri) {
    const textDocumentToReturn = TextDocument.create(
      uri,
      // this._languageId,
      languageID,
      models._versionId,
      models.getValue()
    );
    console.log('_getTextDocument.textDocumentToReturn', textDocumentToReturn);
    return textDocumentToReturn;
    // }
    // console.log('_getTextDocument... early return. uri not match');
    // return null;
    // return models.getValue();
  }
}

export function create(ctx, createData) {
  return new ApidomWorker(ctx, createData);
}
