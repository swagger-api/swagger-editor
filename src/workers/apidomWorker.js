import { getLanguageService, TextDocument } from 'vscode-json-languageservice';
import {
  MonacoToProtocolConverter,
  ProtocolToMonacoConverter,
} from 'monaco-languageclient/lib/monaco-converter';

// import { metadata } from './metadata';

// export a new Class

// from GH issue, this is enough to load the worker
// The onLanguage subscription should be run BEFORE the editor is created, or else it never fires
// The worker is served per Webpack entry definition

// monaco.languages.onLanguage('mylang', () => {
//   this._worker = editor.createWebWorker<MyWorker>({
//     moduleId: 'static/js/mylang.worker.chunk.js', // or 'static/js/mylang.worker.chunk'
//   });
// });

// example reference: https://github.com/microsoft/monaco-css/blob/master/src/cssWorker.ts

// --- model sync -----------------------

// languageId
// languageService
// languageSettings

// --- language service host ---------------

// CSS Worker methods:
// async doValidation
// async doComplete
// async doHover
// async findDefinition
// async findReferences
// async findDocumentHighlights
// async findDocumentSymbols
// async doCodeActions
// async findDocumentColors
// async getColorPresentations
// async getFoldingRanges
// async getSelectionRanges
// async doRename
// private _getTextDocument

// --- export interface, export function ---------------
// export function create(ctx, createData);

// --- Apidom experiment ---------------
// Apidom LSP methods:

// Apidom experiment: export create({ monaco, containerId })
// but most of this experiment should be extracted into its own web worker, like the CSSWorker example

// TS
// const monacoModel: monaco.editor.IModel = editor.getModel();
// function getModel(): monaco.editor.IModel {
//   return monacoModel;
// }

// diff note: monaco.editor already created
export function getModel({ editor }) {
  return editor.getModel();
}

// TS
// function createDocument(model: monaco.editor.IReadOnlyModel) {
//   return TextDocument.create(
//     MODEL_URI,
//     model.getModeId(),
//     model.getVersionId(),
//     model.getValue()
//   );
// }

export function createDocument({ model, modelUri }) {
  return TextDocument.create(modelUri, model.getModeId(), model.getVersionId(), model.getValue());
}

// TS
// function resolveSchema(url: string): Promise<string> {
//   const promise = new Promise<string>((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.onload = () => resolve(xhr.responseText);
//     xhr.onerror = () => reject(xhr.statusText);
//     xhr.open("GET", url, true);
//     xhr.send();
//   });
//   return promise;
// }

export function resolveSchema({ url }) {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.open('GET', url, true);
    xhr.send();
  });
  return promise;
}

// eslint-disable-next-line no-unused-vars
const m2p = new MonacoToProtocolConverter();
const p2m = new ProtocolToMonacoConverter();

/**
 * Validation
 */

const pendingValidationRequests = new Map();

/* @type (document: TextDocument) */
export function cleanPendingValidation({ document }) {
  const request = pendingValidationRequests.get(document.uri);
  if (request !== undefined) {
    clearTimeout(request);
    pendingValidationRequests.delete(document.uri);
  }
}

export function cleanDiagnostics({ editor }) {
  editor.setModelMarkers(getModel({ editor }), 'default', []);
}
// const context = {
//   metadata: metadata(), // TODO: create metadata file, and import it
// };

// const apidomService = getLanguageService(context);

// export function doValidate({ editor, document }) {
//   if (document.getText().length === 0) {
//     cleanDiagnostics({ editor });
//     return;
//   }
//   apidomService.doValidation(document).then((diagnostics) => {
//     const markers = p2m.asDiagnostics(diagnostics);
//     editor.setModelMarkers(getModel({ editor }), 'default', markers);
//   });
// }

// TODO: replace jsonService with apidomService (above), once available
const jsonService = getLanguageService({
  schemaRequestService: resolveSchema,
});

/* @type (document: TextDocument) */
export function doValidateJson({ editor, document, setModelMarkers }) {
  if (document.getText().length === 0) {
    cleanDiagnostics({ editor });
    return;
  }
  const jsonDocument = jsonService.parseJSONDocument(document);
  // console.log('doValidateJson, jsonDocument:', jsonDocument);
  jsonService.doValidation(document, jsonDocument).then((diagnostics) => {
    const markers = p2m.asDiagnostics(diagnostics);
    // console.log('doValidateJson markers:', markers);
    setModelMarkers(getModel({ editor }), 'default', markers); // not a function here or from props
  });
}

export function validate({ editor, setModelMarkers }) {
  const model = getModel({ editor });
  const document = createDocument({ model });
  cleanPendingValidation({ editor, document });
  pendingValidationRequests.set(
    document.uri,
    setTimeout(() => {
      pendingValidationRequests.delete(document.uri);
      // doValidate({ editor, setModelMarkers, document });
      doValidateJson({ editor, setModelMarkers, document });
    })
  );
}

/*
 * Providers
 */

/*
 * monaco.languages.registerDocumentSymbolProvider(languageId, {
 *   provideDocumentSymbols: importPath.provideDocumentSymbols({
 *     editor,
 * })})
 */
export function provideDocumentSymbols({ editor }) {
  const model = getModel({ editor });
  const document = createDocument({ model });
  const jsonDocument = jsonService.parseJSONDocument(document);
  return p2m.asSymbolInformations(jsonService.findDocumentSymbols(document, jsonDocument));
}

/*
 * pre: const position = monaco.Position();
 * monaco.languages.registerHoverProvider(languageId, {
 *   provideHover: importPath.provideHover({
 *     editor,
 *     position,
 * })})
 */
export function provideHover({ editor, position }) {
  const model = getModel({ editor });
  const document = createDocument({ model });
  // const document = createDocument(model);
  const jsonDocument = jsonService.parseJSONDocument(document);
  return jsonService
    .doHover(document, m2p.asPosition(position.lineNumber, position.column), jsonDocument)
    .then((hover) => {
      console.log('so far so good on hover', hover);
      return p2m.asHover(hover);
    });
}

export const ApidomWorker = {
  validate,
};
export default ApidomWorker;
