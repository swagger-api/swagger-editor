// ?worker is a Vite-only transform. Without enforce:'pre', Vite's built-in
// resolution runs first and externalizes the import with the absolute path +
// ?worker suffix baked into the output. With enforce:'pre' our resolveId runs
// first and swaps it for a virtual module.
// The URL is created on a separate line from new Worker() to avoid triggering
// vite:worker-import-meta-url's `new Worker(new URL(...))` pattern detector.
export const rewriteEditorWorkerImport = () => ({
  name: 'rewrite-editor-worker-import',
  enforce: 'pre',
  resolveId(id) {
    if (id.endsWith('?worker')) {
      if (id.includes('editor.worker')) return '\0virtual:editor-worker-constructor';
      if (id.includes('apidom.worker')) return '\0virtual:apidom-worker-constructor';
    }
  },
  load(id) {
    // import.meta.url resolves to the chunk that inlines this virtual module
    // (dist/esm/plugins/editor-monaco/index.js), so ../../ reaches
    // dist/esm/{editor,apidom}.worker.js in native-ESM / Vite consumers.
    //
    // In Webpack-bundled consumers import.meta.url becomes a file:// URL, so
    // we detect that and fall back to globalThis.MonacoEnvironment.baseUrl
    // (a string like 'https://example.com/workers/' that the consumer must set
    // before loading SwaggerEditor when bundling with Webpack or similar tools).
    //
    // The URL is constructed inside the constructor (not at module top-level) so
    // the runtime check runs when the worker is actually spawned and
    // MonacoEnvironment.baseUrl is already in place.
    //
    // The URL is kept on a separate line from new Worker() to prevent Vite's
    // vite:worker-import-meta-url plugin from treating it as a worker asset
    // during the lib build.
    if (id === '\0virtual:editor-worker-constructor') {
      return `export default class EditorWorkerConstructor {
  constructor() {
    const _meta = new URL('../../editor.worker.js', import.meta.url);
    const _url = _meta.protocol === 'file:' ? new URL('editor.worker.js', globalThis.MonacoEnvironment?.baseUrl ?? location.origin) : _meta;
    return new Worker(_url, { type: 'module' });
  }
}`;
    }
    if (id === '\0virtual:apidom-worker-constructor') {
      return `export default class ApidomWorkerConstructor {
  constructor() {
    const _meta = new URL('../../apidom.worker.js', import.meta.url);
    const _url = _meta.protocol === 'file:' ? new URL('apidom.worker.js', globalThis.MonacoEnvironment?.baseUrl ?? location.origin) : _meta;
    return new Worker(_url, { type: 'module' });
  }
}`;
    }
  },
});
