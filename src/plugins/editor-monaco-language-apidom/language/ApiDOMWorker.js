/* eslint-disable no-underscore-dangle */
import * as vscodeLanguageServerTextDocument from 'vscode-languageserver-textdocument';
import * as apidomLS from '@swagger-api/apidom-ls';

export class ApiDOMWorker {
  static apiDOMContext = {
    validatorProviders: [],
    completionProviders: [],
    performanceLogs: false,
    logLevel: apidomLS.LogLevel.WARN,
    defaultLanguageContent: {
      namespace: 'asyncapi',
    },
  };

  constructor(ctx, createData) {
    this._ctx = ctx;
    this._createData = createData;
    this._languageService = apidomLS.getLanguageService(this.constructor.apiDOMContext);
  }

  async doValidation(uri) {
    const document = this._getTextDocument(uri);
    if (!document) {
      return [];
    }
    return this._languageService.doValidation(document);
  }

  async doComplete(uri, position) {
    const document = this._getTextDocument(uri);
    if (!document) {
      return [];
    }
    return this._languageService.doCompletion(document, position);
  }

  async doHover(uri, position) {
    const document = this._getTextDocument(uri);
    if (!document) {
      return [];
    }
    return this._languageService.doHover(document, position);
  }

  async doLinks(uri) {
    const document = this._getTextDocument(uri);
    if (!document) {
      return [];
    }
    return this._languageService.doLinks(document);
  }

  async findDocumentSymbols(uri) {
    const document = this._getTextDocument(uri);
    if (!document) {
      return [];
    }
    return this._languageService.doFindDocumentSymbols(document);
  }

  async provideDefinition(uri, position) {
    const document = this._getTextDocument(uri);
    if (!document) {
      return [];
    }
    return this._languageService.doProvideDefinition(document, {
      uri,
      position,
    });
  }

  async doCodeActions(uri, diagnostics) {
    const document = this._getTextDocument(uri);
    if (!document) {
      return [];
    }
    return this._languageService.doCodeActions(document, diagnostics);
  }

  async findSemanticTokens(uri) {
    const document = this._getTextDocument(uri);
    if (!document) {
      return [];
    }
    return this._languageService.computeSemanticTokens(document);
  }

  async getSemanticTokensLegend() {
    return this._languageService.getSemanticTokensLegend();
  }

  _getTextDocument(uri) {
    const [model] = this._ctx.getMirrorModels();
    /**
     * When there are multiple files open, this will be an array
     * expect models: _lines[], _uri, _versionId
     * expect models.uri.toString() to be singular, e.g. inmemory://model/1
     * thus, before returning a TextDocument, we can optionally
     * validate that models.uri.toString() === uri
     * fyi, reference more complete example in cssWorker
     * https://github.com/microsoft/monaco-css/blob/master/src/cssWorker.ts
     * which we might want later to handle multiple URIs.
     */

    return vscodeLanguageServerTextDocument.TextDocument.create(
      uri,
      this._createData.languageId,
      model.version,
      model.getValue()
    );
  }
}

export const makeCreate = (BaseClass) => (ctx, createData) => {
  let ApiDOMWorkerClass = BaseClass;

  if (createData.customWorkerPath) {
    if (typeof globalThis.importScripts === 'undefined') {
      // eslint-disable-next-line no-console
      console.warn(
        'Monaco is not using webworkers for background tasks, and that is needed to support the customWorkerPath flag'
      );
    } else {
      if (Array.isArray(createData.customWorkerPath)) {
        globalThis.importScripts(...createData.customWorkerPath);
      } else {
        globalThis.importScripts(createData.customWorkerPath);
      }

      const { customApiDOMWorkerFactory: workerFactoryFunc } = globalThis;
      if (typeof workerFactoryFunc !== 'function') {
        throw new Error(
          `The script at ${createData.customWorkerPath} does not add customApiDOMWorkerFactory to globalThis`
        );
      }

      ApiDOMWorkerClass = workerFactoryFunc(ApiDOMWorkerClass, {
        apidomLS,
        vscodeLanguageServerTextDocument,
      });
    }
  }

  return new ApiDOMWorkerClass(ctx, createData);
};
