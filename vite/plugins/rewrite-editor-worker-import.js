// ?worker is a Vite-only transform. Without enforce:'pre', Vite's built-in
// resolution runs first and externalizes the import with the absolute path +
// ?worker suffix baked into the output. With enforce:'pre' our resolveId runs
// first and swaps it for a virtual module.
// The URL is created on a separate line from new Worker() to avoid triggering
// vite:worker-import-meta-url's `new Worker(new URL(...))` pattern detector.

// Maps ?worker import substrings to their virtual module IDs.
const WORKER_VIRTUAL_IDS = {
  'editor.worker': '\0virtual:editor-worker-constructor',
  'apidom.worker': '\0virtual:apidom-worker-constructor',
};

// Generates the virtual module code for a given worker filename and class name.
// import.meta.url resolves to the inlined chunk (dist/esm/plugins/editor-monaco/index.js),
// so ../../ reaches dist/esm/{editor,apidom}.worker.js for native-ESM / Vite consumers.
// Webpack consumers get a file:// URL from import.meta.url, so we fall back to
// globalThis.MonacoEnvironment.baseUrl (set by the consumer before loading SwaggerEditor).
// The URL is built inside the constructor so MonacoEnvironment.baseUrl is already set
// when the worker is spawned, and separate from new Worker() to avoid the
// vite:worker-import-meta-url asset-detection pattern.
const workerConstructorCode = (className, filename) => `\
export default class ${className} {
  constructor() {
    const _meta = new URL('../../${filename}', import.meta.url);
    const _url = _meta.protocol === 'file:'
      ? new URL('./${filename}', globalThis.MonacoEnvironment?.baseUrl ?? location.origin)
      : _meta;
    return new Worker(_url, { type: 'module' });
  }
}`;

const WORKER_VIRTUAL_MODULES = {
  '\0virtual:editor-worker-constructor': workerConstructorCode(
    'EditorWorkerConstructor',
    'editor.worker.js'
  ),
  '\0virtual:apidom-worker-constructor': workerConstructorCode(
    'ApidomWorkerConstructor',
    'apidom.worker.js'
  ),
};

export const rewriteEditorWorkerImport = () => ({
  name: 'rewrite-editor-worker-import',
  enforce: 'pre',
  resolveId(id) {
    if (!id.endsWith('?worker')) return null;
    const match = Object.keys(WORKER_VIRTUAL_IDS).find((key) => id.includes(key));
    return match ? WORKER_VIRTUAL_IDS[match] : null;
  },
  load(id) {
    return WORKER_VIRTUAL_MODULES[id] ?? null;
  },
});
