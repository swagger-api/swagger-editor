/* eslint-disable no-underscore-dangle */
import deepExtend from 'deep-extend';
import * as vscodeLanguageServerTextDocument from 'vscode-languageserver-textdocument';
import * as apidomLS from '@swagger-api/apidom-ls';
import * as apidomNSOpenAPI2 from '@swagger-api/apidom-ns-openapi-2';
import * as apidomNSOpenAPI30 from '@swagger-api/apidom-ns-openapi-3-0';

export class ApiDOMWorker {
  static defaultApiDOMContext = {
    validatorProviders: [],
    completionProviders: [],
    performanceLogs: false,
    logLevel: apidomLS.LogLevel.WARN,
    completionContext: {
      maxNumberOfItems: 100,
      enableLSPFilter: false, // enables "strict" word filtering (instead of default Monaco fuzzy matching; https://github.com/swagger-api/apidom/pull/2954)
    },
    validationContext: {
      referenceValidationContinueOnError: true,
      referenceValidationMode: apidomLS.ReferenceValidationMode.APIDOM_INDIRECT_EXTERNAL,
    },
    referenceOptions: {
      resolve: {
        resolverOpts: {
          cacheTTL: 60 * 1000, // store the result in a cache for 60 seconds
        },
      },
    },
  };

  constructor(ctx, createData) {
    this._ctx = ctx;
    this._createData = createData;
    this._languageService = this.createLanguageService();
  }

  createLanguageService() {
    return apidomLS.getLanguageService(
      deepExtend({}, this.constructor.defaultApiDOMContext, this._createData.apiDOMContext)
    );
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

  async doDeref(uri, dereferenceContext = {}) {
    const document = this._getTextDocument(uri);
    if (!document) {
      return [];
    }

    return this._languageService.doDeref(document, dereferenceContext);
  }

  async getJsonPointerPosition(uri, jsonPointer) {
    const document = this._getTextDocument(uri);
    if (!document) {
      return [];
    }

    return this._languageService.getJsonPointerPosition(document, jsonPointer);
  }

  _getTextDocument(uri) {
    const model = this._ctx.getMirrorModels().find((mm) => mm.uri.toString() === uri);

    if (!model) return null;

    return vscodeLanguageServerTextDocument.TextDocument.create(
      uri,
      this._createData.languageId,
      model.version,
      model.getValue()
    );
  }
}

export const makeCreate = (BaseClass) => (ctx, createData) => {
  const toolbelt = {
    apidomLS,
    apidomNSOpenAPI2,
    apidomNSOpenAPI30,
    vscodeLanguageServerTextDocument,
    deepExtend,
  };

  const instancePromise = (async () => {
    let ApiDOMWorkerClass = BaseClass;

    if (createData.customWorkerPath) {
      // eslint-disable-next-line no-restricted-syntax
      for (const path of [].concat(createData.customWorkerPath)) {
        if (typeof path !== 'string' || !path) {
          // eslint-disable-next-line no-console
          console.warn('customWorkerPath contains an invalid entry (skipped):', path);
          // eslint-disable-next-line no-continue
          continue;
        }
        // eslint-disable-next-line no-await-in-loop
        const mod = await import(/* webpackIgnore: true */ /* @vite-ignore */ path);
        const factory = mod.customApiDOMWorkerFactory ?? globalThis.customApiDOMWorkerFactory;
        if (typeof factory !== 'function') {
          throw new TypeError(`The module at ${path} does not export customApiDOMWorkerFactory`);
        }
        ApiDOMWorkerClass = factory(ApiDOMWorkerClass, toolbelt);
      }
    }

    return new ApiDOMWorkerClass(ctx, createData);
  })();

  const callOnInstance = (prop, args) =>
    instancePromise.then((instance) => instance[prop](...args));

  return new Proxy(
    {},
    {
      get(_, prop) {
        if (typeof prop !== 'string') return undefined;
        return (...args) => callOnInstance(prop, args);
      },
    }
  );
};
