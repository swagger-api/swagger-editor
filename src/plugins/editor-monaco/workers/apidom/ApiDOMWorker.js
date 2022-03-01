/* eslint-disable no-underscore-dangle */
import { TextDocument } from 'vscode-languageserver-textdocument'; // this is true source
import { getLanguageService, LogLevel } from '@swagger-api/apidom-ls';

import { languageID } from '../../adapters/config.js';

export class ApiDOMWorker {
  // eslint-disable-next-line no-unused-vars
  constructor(ctx, createData) {
    this._ctx = ctx;
    // define this._x for languageSettings, languageId, languageService
    const apidomContext = {
      validatorProviders: [],
      performanceLogs: false,
      logLevel: LogLevel.WARN,
    };
    this._languageService = getLanguageService(apidomContext);
  }

  async doValidation(uri) {
    const document = this._getTextDocument(uri); // call a private method
    if (!document) {
      return Promise.resolve([]);
    }
    const diagnostics = await this._languageService.doValidation(document);
    return Promise.resolve(diagnostics);
  }

  async doComplete(uri, position) {
    const document = this._getTextDocument(uri); // call a private method
    if (!document) {
      return Promise.resolve([]);
    }
    const completions = await this._languageService.doCompletion(document, position);
    return Promise.resolve(completions);
  }

  async doHover(uri, position) {
    const document = this._getTextDocument(uri); // call a private method
    if (!document) {
      return Promise.resolve([]);
    }
    const hover = await this._languageService.doHover(document, position);
    return Promise.resolve(hover);
  }

  async findDocumentSymbols(uri) {
    const document = this._getTextDocument(uri); // call a private method
    if (!document) {
      return Promise.resolve([]);
    }
    const symbols = await this._languageService.doFindDocumentSymbols(document);
    return Promise.resolve(symbols);
  }

  async provideDefinition(uri, position) {
    const document = this._getTextDocument(uri); // call a private method
    if (!document) {
      return Promise.resolve([]);
    }
    const definitions = await this._languageService.doProvideDefinition(document, {
      uri,
      position,
    });
    return Promise.resolve(definitions);
  }

  async doCodeActions(uri, diagnostics) {
    const document = this._getTextDocument(uri); // call a private method
    if (!document) {
      return Promise.resolve([]);
    }
    const codeActions = await this._languageService.doCodeActions(document, diagnostics);
    return Promise.resolve(codeActions);
  }

  async findSemanticTokens(uri) {
    const document = this._getTextDocument(uri); // call a private method
    if (!document) {
      return Promise.resolve([]);
    }
    const semanticTokens = await this._languageService.computeSemanticTokens(document);
    return Promise.resolve(semanticTokens);
  }

  async getSemanticTokensLegend() {
    const semanticTokensLegend = await this._languageService.getSemanticTokensLegend();
    return Promise.resolve(semanticTokensLegend);
  }

  // intended as private method
  _getTextDocument(uri) {
    const models = this._ctx.getMirrorModels()[0]; // When there are multiple files open, this will be an array
    // expect models: _lines[], _uri, _versionId
    // expect models.uri.toString() to be singular, e.g. inmemory://model/1
    // thus, before returning a TextDocument, we can optionally
    // validate that models.uri.toString() === uri
    // fyi, reference more complete example in cssWorker
    // https://github.com/microsoft/monaco-css/blob/master/src/cssWorker.ts
    // which we might want later to handle multiple URIs
    const textDocumentToReturn = TextDocument.create(
      uri,
      languageID,
      models._versionId,
      models.getValue()
    );
    return textDocumentToReturn;
  }
}

export function create(ctx, createData) {
  return new ApiDOMWorker(ctx, createData);
}
