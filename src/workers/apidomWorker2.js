/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
// import * as monaco from 'monaco-editor-core'; // TS interface
import { TextDocument } from 'vscode-languageserver-textdocument'; // this is true source
// import { getLanguageService } from 'vscode-json-languageservice'; // will eventually come from apidom
import {
  // CompletionContext,
  getLanguageService,
  // LanguageServiceContext,
} from 'apidom-ls';

import { languageID } from '../utils/samples/config';
// eslint-disable-next-line no-unused-vars
import metadata from './metadataJs';

export class ApidomWorker {
  // eslint-disable-next-line no-unused-vars
  constructor(ctx, createData) {
    this._ctx = ctx;
    // define this._x for languageSettings, languageId, languageService
    // this._languageService = getLanguageService(this._ctx);
    this._languageService = getLanguageService(metadata); // use apidom metadata
    // this._languageService.configure(this._languageSettings);
  }

  async doValidation(uri) {
    const document = this._getTextDocument(uri); // call a private method
    // console.log('inside worker. document:', document); // ok
    if (document) {
      // note: in cssWorker example, doValidation(document, parsedStylesheet)
      // Case: json
      // const jsonDocument = this._languageService.parseJSONDocument(document);
      // console.log('doValidation... jsonDocument', jsonDocument);
      // the jsonService version expects (textDocument, jsonDocument)
      // const diagnostics = await this._languageService.doValidation(document, jsonDocument);
      // console.log('doValidation... diagnostics:', diagnostics); // pending Promise
      // Case: apidom
      const diagnostics = await this._languageService.doValidation(document);
      return Promise.resolve(diagnostics);
    }
    return Promise.resolve([]);
  }

  async doComplete(uri, position) {
    const document = this._getTextDocument(uri); // call a private method
    const jsonDocument = this._languageService.parseJSONDocument(document);
    const completions = await this._languageService.doComplete(document, position, jsonDocument);
    return Promise.resolve(completions);
  }

  async doHover(uri, position) {
    const document = this._getTextDocument(uri); // call a private method
    // Case: json
    // const jsonDocument = this._languageService.parseJSONDocument(document);
    // const hover = await this._languageService.doHover(document, position, jsonDocument);
    // Case: apidom
    const hover = await this._languageService.doHover(document, position);
    console.log('doHover... hover:', hover);
    return Promise.resolve(hover);
  }

  async findDocumentSymbols(uri) {
    const document = this._getTextDocument(uri); // call a private method
    const jsonDocument = this._languageService.parseJSONDocument(document);
    const symbols = await this._languageService.findDocumentSymbols(document, jsonDocument);
    return Promise.resolve(symbols);
  }

  // intended as private method
  // eslint-disable-next-line no-unused-vars
  _getTextDocument(uri) {
    // console.log('_getTextDocument... args: uri', uri);
    const models = this._ctx.getMirrorModels()[0]; // When there are multiple files open, this will be an array
    // console.log('_getTextDocument.models', models);
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
    // console.log('_getTextDocument.textDocumentToReturn', textDocumentToReturn);
    return textDocumentToReturn;
    // }
    // console.log('_getTextDocument... early return. uri not match');
    // return null;
  }
}

export function create(ctx, createData) {
  return new ApidomWorker(ctx, createData);
}
