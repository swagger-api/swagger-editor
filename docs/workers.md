# Web Workers in SwaggerEditor (Vite Build)

## Overview

SwaggerEditor uses three Web Workers:

| Worker | Label | Purpose |
|--------|-------|---------|
| `editor.worker` | `editorWorkerService` | Monaco core text-model operations (diffing, link detection, bracket matching) |
| `apidom.worker` | `apidom` | ApiDOM language server (validation, hover, completion, semantic tokens) |
| `asyncapi-parser.worker` | — | AsyncAPI spec parsing off the main thread (Comlink-based, not Monaco-managed) |

Monaco's `StandaloneWebWorkerService` dispatches to whichever worker matches a given label via `MonacoEnvironment.getWorker`. The AsyncAPI parser worker is not Monaco-managed and is spawned directly by the `editor-preview-asyncapi` plugin.

---

## How Workers Are Loaded

### `MonacoEnvironment.getWorker` — the dispatch function

Set in `src/plugins/editor-monaco/after-load.js`:

```js
import EditorWorkerConstructor from '@codingame/monaco-vscode-api/workers/editor.worker?worker';
import ApidomWorkerConstructor from '../editor-monaco-language-apidom/language/apidom.worker.js?worker';

globalThis.MonacoEnvironment = {
  baseUrl: document.baseURI || location.href,
  getWorker(workerId, label) {
    if (label === 'apidom') return new ApidomWorkerConstructor();
    return new EditorWorkerConstructor();
  },
  ...globalThis.MonacoEnvironment,
};
```

Both `?worker` imports are intercepted by `vite/plugins/rewrite-editor-worker-import.js`, which replaces them with virtual constructor modules. Each constructor resolves the worker URL at spawn time:

```js
// Generated virtual module (simplified)
export default class ApidomWorkerConstructor {
  constructor() {
    const _meta = new URL('../../apidom.worker.js', import.meta.url);
    const _url = _meta.protocol === 'file:'
      ? new URL('./apidom.worker.js', globalThis.MonacoEnvironment?.baseUrl ?? location.origin)
      : _meta;
    return new Worker(_url, { type: 'module' });
  }
}
```

- **Vite / native-ESM consumers**: `import.meta.url` is an `https:` URL, so `_meta` resolves relative to the inlined chunk in `dist/esm/`. No `MonacoEnvironment.baseUrl` needed.
- **Webpack consumers**: `import.meta.url` is a `file:` URL, so the fallback uses `MonacoEnvironment.baseUrl`. The filename is prefixed with `./` so that Webpack consumer tooling (e.g. `ReplaceAssetNamePlugin`) can locate and replace it with the hashed output filename.

Monaco calls `getWorker` and wraps the returned `Worker` in `Promise.resolve()`, bypassing the blob-URL fallback path entirely.

---

## Editor Worker (`editorWorkerService`)

### Dev mode

Loaded via Vite's `?worker` import query:

```js
import EditorWorkerConstructor from '@codingame/monaco-vscode-api/workers/editor.worker?worker';
```

Vite resolves this to a factory function that creates:

```js
new Worker('/node_modules/@codingame/monaco-vscode-api/workers/editor.worker.js?worker_file&type=module', { type: 'module' })
```

When the browser fetches `?worker_file&type=module`, Vite:
1. Injects `/node_modules/vite/dist/client/env.mjs` — this sets `global = globalThis`, satisfying Monaco's global shim requirement
2. Rewrites all bare module specifiers to absolute dev-server paths

The `?worker` import syntax is required for `node_modules/` worker files because Vite must rewrite the bare specifiers inside them (e.g. `@codingame/monaco-vscode-api/vscode/src/vs/...`). A plain `new Worker(url)` would serve the file without that transformation.

### Production (app build)

Built by Vite's worker builder via the same `?worker` import. Output path is controlled by
`worker.rollupOptions.output.entryFileNames` in `vite.config.app.js`:

```js
worker: {
  format: 'es',
  rollupOptions: {
    output: {
      entryFileNames: 'static/js/[name].[hash].js',
    },
  },
}
```

Output: `build/static/js/editor.worker.[hash].js`. The hashed URL is injected automatically into
`new EditorWorkerConstructor()` by Vite at build time.

---

## ApiDOM Worker (`apidom`)

### Dev mode

Loaded via Vite's `?worker` import query in `after-load.js`:

```js
import ApidomWorkerConstructor from '../editor-monaco-language-apidom/language/apidom.worker.js?worker';
```

Vite's **transform middleware** intercepts the worker file request and rewrites bare specifiers inside `apidom.worker.js`:

```js
// Source (src/plugins/.../apidom.worker.js)
import { initialize } from 'monaco-editor/esm/vs/editor/editor.worker.js';

// After Vite transform
import { initialize } from '/node_modules/.vite/deps/monaco-editor_esm_vs_editor_editor__worker__js.js?v=...';
```

The pre-bundled dep (`optimizeDeps.include` declares `monaco-editor/esm/vs/editor/editor.worker.js`) is a self-contained bundle of Monaco's editor worker bootstrap plus the ApiDOM worker's `initialize` export.

**Critical:** Do NOT add `apidom.worker.js` as a `viteStaticCopy` target in `vite.config.js`. The static-copy plugin inserts its middleware **before** Vite's transform middleware and would serve the file raw (with untransformed bare specifiers), causing the worker to fail with a module resolution error.

### Production (app build)

Built by Vite's worker builder via the same `?worker` import. Shares the same
`worker.rollupOptions.output.entryFileNames` config as the editor worker (see above).

Output: `build/static/js/apidom.worker.[hash].js`. The hashed URL is injected automatically into
`new ApidomWorkerConstructor()` by Vite at build time.

---

## AsyncAPI Parser Worker

### Purpose

Offloads `@asyncapi/parser` parsing off the main thread so large or complex AsyncAPI specs don't block the UI. Managed by the `editor-preview-asyncapi` plugin via [Comlink](https://github.com/GoogleChromeLabs/comlink), not by Monaco.

### How it is loaded

`src/plugins/editor-preview-asyncapi/worker/parser-worker-proxy.ts` holds a lazy singleton:

```ts
import * as Comlink from 'comlink';
import AsyncAPIParserWorkerConstructor from './asyncapi-parser.worker.ts?worker';

let proxy = null;

const getParserProxy = async (parserOptions) => {
  if (!proxy) {
    proxy = Comlink.wrap(new AsyncAPIParserWorkerConstructor());
    await proxy.init(wrapResolvers(parserOptions));
  }
  return proxy;
};
```

The `?worker` import is intercepted by `vite/plugins/rewrite-editor-worker-import.js` — the same virtual-constructor mechanism used by the Monaco workers — so the worker URL resolves correctly in both dev and production.

### Passing custom `parserOptions`

`getParserProxy(parserOptions)` accepts a subset of `@asyncapi/parser`'s `ParserOptions`. Fields that contain functions (e.g. custom `__unstable.resolver.resolvers`) must be wrapped with `Comlink.proxy()` **before** being passed to the worker, so they execute on the main thread and retain access to the Redux store, `document`, etc.:

```js
import * as Comlink from 'comlink';

const parserOptions = {
  __unstable: {
    resolver: {
      resolvers: [httpsFetchResolver, httpFetchResolver].map((r) => ({
        schema: r.schema,
        order: r.order,
        canRead: r.canRead,
        read: Comlink.proxy(r.read.bind(r)),
      })),
    },
  },
};
```

`parser-worker-proxy.ts` applies this wrapping automatically via its `wrapResolvers` helper — consumers pass plain resolver objects and the proxy handles the `Comlink.proxy()` calls.

`parserOptions` are applied once when the proxy is first created. Changing them after the first `parse()` call requires re-creating the proxy (not currently supported).

### `Uri` transfer handler

`@asyncapi/parser` passes `urijs` `Uri` objects to resolver `read()` and `canRead()` functions. `Uri` class instances don't survive structured clone, so the worker registers a Comlink transfer handler at module load that converts `Uri → string` transparently before the argument crosses the boundary:

```ts
Comlink.transferHandlers.set('URI', {
  canHandle: (obj) => obj instanceof Uri,
  serialize: (uri) => [uri.toString(), []],
  deserialize: (str) => str,
});
```

The main thread `read(uri)` functions receive the string. `uri.toString()` on a string is a no-op, so existing resolver implementations work without modification.

### Dev mode

Loaded via the virtual constructor module (same as Monaco workers). Vite's transform middleware rewrites bare specifiers inside the worker source.

### Production (app build)

Built by Vite's worker builder via the `?worker` import. Output: `build/static/js/asyncapi-parser.worker.[hash].js`.

### ESM / UMD library builds

Built as a separate self-contained bundle by `vite/scripts/build-bundle-esm.js` and `build-bundle-umd.js` using `asyncapiParserWorkerConfig`. Both configs include `fsShimPlugin` and `nodePolyfills()` to satisfy `@asyncapi/parser`'s Node.js `fs` references in the browser bundle.

---

## `MonacoEnvironment` Setup Order

`after-load.js` runs first and sets `getWorker`. It spreads any existing `MonacoEnvironment` at the end, allowing a consuming app to pre-set overrides (e.g. `baseUrl`):

```js
globalThis.MonacoEnvironment = {
  // defaults first
  baseUrl: ...,
  getWorker(...) { ... },
  // consumer overrides win
  ...globalThis.MonacoEnvironment,
};
```

`lazyMonacoContribution` (called immediately after) spreads the existing object in the opposite direction, adding `getWorkerUrl` without overwriting `getWorker`:

```js
globalThis.MonacoEnvironment = {
  ...globalThis.MonacoEnvironment,  // preserves getWorker
  getWorkerUrl(...) { ... },        // only reached if getWorker is absent
};
```

The `initPhase` guard (`UNINITIALIZED → IN_PROGRESS → INITIALIZED`) prevents `initializeMonacoServices` from being called twice if the plugin is somehow loaded more than once. Monaco's standalone services can only be initialized once and cannot be disposed.

### `getWorkerUrl` / `getWorker` precedence

`StandaloneWebWorkerService._createWorker` checks `getWorker` first and returns early if it is defined. `getWorkerUrl` is only consulted if `getWorker` is absent. Since `after-load.js` always sets `getWorker`, no `getWorkerUrl` fallback is needed in `monaco.contribution.js`. The fallback that existed there has been removed.

---

## Environment Variables

Defined in `.env`, baked into the bundle at build time:

| Variable | Value | Used by |
|----------|-------|---------|
| `VITE_VERSION` | `$npm_package_version` | Splash screen version display |

Worker URLs are resolved automatically by Vite's `?worker` import transform — no env vars required.

---

## `optimizeDeps.include` entries for workers

In `vite.config.js`:

```js
optimizeDeps: {
  include: [
    '@codingame/monaco-vscode-api/workers/editor.worker', // used by ?worker import chain
    'monaco-editor/esm/vs/editor/editor.worker.js',       // used by apidom.worker.js
  ],
}
```

Pre-declaring these avoids a cold-start dep-optimization reload on the first page load after clearing the Vite cache.

---

## ESM / UMD Library Builds

`vite.config.esm.js` builds both workers as separate Rollup entry points alongside the library bundle. `vite.config.umd.js` exports `apidomWorkerConfig` and `editorWorkerConfig` as named Vite configs for the same purpose.

```
dist/
  esm/
    apidom.worker.js            ← self-contained ESM worker bundle
    editor.worker.js            ← self-contained ESM worker bundle
    asyncapi-parser.worker.js   ← self-contained ESM worker bundle
    index.js                    ← library entry
  umd/
    apidom.worker.js            ← self-contained IIFE worker bundle
    editor.worker.js            ← self-contained IIFE worker bundle
    asyncapi-parser.worker.js   ← self-contained IIFE worker bundle
    index.js
```

**`dist/esm/` workers** are ES modules and are spawned with `{ type: 'module' }` by the virtual constructor modules injected into `after-load.js`. Native-ESM and Vite consumers use these directly.

**`dist/umd/` workers** are IIFE bundles (classic scripts) for compatibility with Webpack-bundled consumers that may not reliably support `{ type: 'module' }` workers.

Library consumers are responsible for hosting these worker files and pointing `MonacoEnvironment.getWorker` (or `getWorkerUrl`) at the hosted URLs. The workers are **not bundled into** the library entry — they must be accessible at runtime via a separate URL.

### Node.js global polyfills in the UMD worker build

The UMD worker build (`vite/configs/worker-configs.umd.js`) must include `nodePolyfills()` in its `rollupOptions.plugins`. `@swagger-api/apidom-ls` and its transitive dependencies (notably `deep-extend`) reference Node.js globals such as `Buffer` directly in code paths that execute at runtime inside the worker. Without the polyfill, the worker throws `ReferenceError: Buffer is not defined` the first time a language-service method is called.

Webpack-bundled consumers avoid this automatically via `ProvidePlugin({ Buffer: ['buffer', 'Buffer'] })`. Vite's worker build does **not** inherit polyfills from the parent `vite.config.js` — the UMD config is fully isolated and must declare them explicitly:

```js
// vite/configs/worker-configs.umd.js
rollupOptions: {
  plugins: [nodePolyfills()],
  onwarn: sharedOnwarn,
},
```

The ESM worker build (`vite/configs/worker-configs.esm.js`) is consumed by Vite-native apps that provide their own polyfill layer, so it does not need `nodePolyfills()` itself.

---

## Common Failure Modes

### `ReferenceError: Buffer is not defined` + `Error: WebWorker already initialized!`

These two errors appear together and have a single root cause: the `dist/umd/apidom.worker.js` was built without Node.js global polyfills (see [Node.js global polyfills in the UMD worker build](#nodejs-global-polyfills-in-the-umd-worker-build) above).

The sequence:
1. The worker IIFE completes; `initialize(factory)` runs and sets `self.onmessage` to the start-handler.
2. `WorkerManager.postMessage(createData)` arrives → start-handler calls `start()` → `initialize$1()` succeeds (`initialized$1 = true`), protocol handler set.
3. Monaco routes the first "create" command through the protocol → factory called → `new ApiDOMWorker(ctx, createData)` → `createLanguageService()` → `deepExtend()` evaluates `value instanceof Buffer` → **`Buffer is not defined`** thrown.
4. The factory throw propagates through `@codingame/monaco-vscode-api`'s `WebWorkerServer` error path, which calls `start()` again on the same worker → `initialize$1()` with `initialized$1 = true` → **"WebWorker already initialized!"**

Fix: add `nodePolyfills()` to the UMD worker build (see above). Once the factory succeeds on the first call, Monaco has no reason to retry and `initialize$1` is only ever called once.

### Worker fails with `Event {type: 'error', message: undefined}`

Bare module specifier not rewritten. Causes:
- A `viteStaticCopy` target mapping the same URL as a worker source file (serves raw file before Vite can transform it)
- Worker file accessed without Vite's transform (e.g., plain `new Worker(url)` on a `node_modules/` file)

Fix: use `?worker` for `node_modules/` files; let Vite's transform middleware serve `src/` worker files.

### "Could not create web worker(s). Falling back to loading web worker code in main thread"

Monaco caught an `error` event on a worker. The second `console.warn(undefined)` that follows is `console.warn(err.message)` where `err` is a raw DOM `Event` object (no `.message` property). Trace the actual worker failure to find the root cause.

### First-load dep-optimization reload triggers transient worker errors

Expected on cold cache. Vite discovers new deps during the first page scan, triggers a hot reload, and workers created during that first load are terminated. Errors during this window are benign and do not repeat on subsequent loads.
