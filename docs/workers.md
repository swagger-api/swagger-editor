# Web Workers in SwaggerEditor (Vite Build)

## Overview

SwaggerEditor uses two Web Workers:

| Worker | Label | Purpose |
|--------|-------|---------|
| `editor.worker` | `editorWorkerService` | Monaco core text-model operations (diffing, link detection, bracket matching) |
| `apidom.worker` | `apidom` | ApiDOM language server (validation, hover, completion, semantic tokens) |

Monaco's `StandaloneWebWorkerService` dispatches to whichever worker matches a given label via `MonacoEnvironment.getWorker`.

---

## How Workers Are Loaded

### `MonacoEnvironment.getWorker` — the dispatch function

Set in `src/plugins/editor-monaco/after-load.js`:

```js
import EditorWorkerConstructor from '@codingame/monaco-vscode-api/workers/editor.worker?worker';

globalThis.MonacoEnvironment = {
  baseUrl: document.baseURI || location.href,
  getWorker(workerId, label) {
    if (label === 'apidom') {
      const workerPath = import.meta.env.DEV
        ? import.meta.env.VITE_APIDOM_WORKER_PATH       // '/src/plugins/.../apidom.worker.js'
        : import.meta.env.VITE_APIDOM_WORKER_FILENAME;  // '/apidom.worker.js'
      return new Worker(new URL(workerPath, this.baseUrl), { type: 'module' });
    }
    return new EditorWorkerConstructor();
  },
  ...globalThis.MonacoEnvironment,
};
```

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

Built as a rollup entry point in `vite.config.app.js`:

```js
rollupOptions: {
  input: {
    'editor.worker': 'node_modules/monaco-editor/esm/vs/editor/editor.worker.js',
  },
  output: {
    entryFileNames: (chunk) => chunk.name.includes('worker') ? '[name].js' : 'static/js/[name].[hash].js',
  },
}
```

Output: `build/editor.worker.js`, served at `/editor.worker.js`.

---

## ApiDOM Worker (`apidom`)

### Dev mode

Loaded via a direct URL using the `VITE_APIDOM_WORKER_PATH` env var:

```js
new Worker(new URL('/src/plugins/editor-monaco-language-apidom/language/apidom.worker.js', baseUrl), { type: 'module' })
```

Vite's **transform middleware** intercepts this request and rewrites the bare specifier inside `apidom.worker.js`:

```js
// Source (src/plugins/.../apidom.worker.js)
import { initialize } from 'monaco-editor/esm/vs/editor/editor.worker.js';

// After Vite transform
import { initialize } from '/node_modules/.vite/deps/monaco-editor_esm_vs_editor_editor__worker__js.js?v=...';
```

The pre-bundled dep (`optimizeDeps.include` declares `monaco-editor/esm/vs/editor/editor.worker.js`) is a self-contained bundle of Monaco's editor worker bootstrap plus the ApiDOM worker's `initialize` export.

**Critical:** Do NOT add `apidom.worker.js` as a `viteStaticCopy` target in `vite.config.js`. The static-copy plugin inserts its middleware **before** Vite's transform middleware and would serve the file raw (with untransformed bare specifiers), causing the worker to fail with a module resolution error.

### Production (app build)

Built as a rollup entry point in `vite.config.app.js`:

```js
rollupOptions: {
  input: {
    'apidom.worker': 'src/plugins/editor-monaco-language-apidom/language/apidom.worker.js',
  },
}
```

Output: `build/apidom.worker.js`, served at `/apidom.worker.js`.

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

| Variable | Dev value | Prod value | Used by |
|----------|-----------|------------|---------|
| `VITE_APIDOM_WORKER_PATH` | `/src/plugins/editor-monaco-language-apidom/language/apidom.worker.js` | — | `after-load.js` dev path |
| `VITE_APIDOM_WORKER_FILENAME` | — | `/apidom.worker.js` | `after-load.js` prod path |

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
    apidom.worker.js   ← standalone worker bundle
    editor.worker.js   ← standalone worker bundle
    index.js           ← library entry
  umd/
    apidom.worker.js
    editor.worker.js
    index.js
```

Library consumers are responsible for hosting these worker files and pointing `MonacoEnvironment.getWorker` (or `getWorkerUrl`) at the hosted URLs. The workers are **not bundled into** the library entry — they must be accessible at runtime via a separate URL.

---

## Common Failure Modes

### Worker fails with `Event {type: 'error', message: undefined}`

Bare module specifier not rewritten. Causes:
- A `viteStaticCopy` target mapping the same URL as a worker source file (serves raw file before Vite can transform it)
- Worker file accessed without Vite's transform (e.g., plain `new Worker(url)` on a `node_modules/` file)

Fix: use `?worker` for `node_modules/` files; let Vite's transform middleware serve `src/` worker files.

### "Could not create web worker(s). Falling back to loading web worker code in main thread"

Monaco caught an `error` event on a worker. The second `console.warn(undefined)` that follows is `console.warn(err.message)` where `err` is a raw DOM `Event` object (no `.message` property). Trace the actual worker failure to find the root cause.

### First-load dep-optimization reload triggers transient worker errors

Expected on cold cache. Vite discovers new deps during the first page scan, triggers a hot reload, and workers created during that first load are terminated. Errors during this window are benign and do not repeat on subsequent loads.
