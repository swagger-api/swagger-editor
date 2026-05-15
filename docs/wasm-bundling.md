# WASM Bundling in ESM/UMD Library Builds

The `apidom.worker.js` IIFE bundle contains three WASM binaries that must be fully
self-contained — no runtime HTTP fetches — for the worker to function inside a
Webpack-bundled consumer (swagger-editor-plus and similar).

## The three binaries

| Binary | Source | How it is loaded at runtime |
|--------|--------|-----------------------------|
| `tree-sitter.wasm` | `web-tree-sitter` (emscripten) | Emscripten's own `locateFile()` / `fetch()` machinery |
| `tree-sitter-yaml.wasm` | `@swagger-api/apidom-parser-adapter-yaml-1-2` | `web-tree-sitter` `Language.load(arg)` |
| `tree-sitter-json.wasm` | `@swagger-api/apidom-parser-adapter-json` | `web-tree-sitter` `Language.load(arg)` |

---

## `tree-sitter.wasm` — emscripten runtime binary

### The problem

`@rollup/plugin-wasm` (with `targetEnv: 'auto-inline'`) intercepts the
`import treeSitterWasm from 'web-tree-sitter/tree-sitter.wasm'` statement and
generates two things:

1. A loader function `tree_sitter_default(imports){ return _loadWasmModule(...) }`
2. A `globalThis.fetch` patch that intercepts `fetch('tree-sitter.wasm')` and
   routes it through the loader function instead.

The fetch patch checks:
```js
globalThis.fetch = (...args) =>
  isString(args[0]) && args[0].endsWith('tree-sitter.wasm')
    ? realFetch(tree_sitter_default, ...)
    : realFetch(...args);
```

Emscripten's runtime calls `fetch(wasmBinaryFile)` where `wasmBinaryFile` is
initially the string `'tree-sitter.wasm'`. The patch intercepts this call and
the loader runs — so far so good.

However, if any other plugin also inlines `tree-sitter.wasm` as a data URI
(e.g., by replacing the `'tree-sitter.wasm'` literal), the `endsWith` condition
becomes `url.endsWith('<250KB data URI>')`. A string always ends with itself, so
when emscripten then calls `fetch(dataUri)`, the broken branch fires and passes
the loader *function* as the URL argument to `realFetch`, producing a request to
`http://…/function%20tree_sitter_default(Sn)%20{…}`.

### The fix — `inlineTreeSitterWasm` in `vite.config.esm.js` / `vite.config.umd.js`

Instead of replacing the `'tree-sitter.wasm'` literal, inject the binary into
emscripten's `Module` object **before** any fetch is attempted. Emscripten reads
`Module.wasmBinary` into a local variable during module init, and
`getBinaryPromise()` checks that variable first:

```js
function getBinaryPromise(path) {
  return wasmBinary          // ← truthy → fetch is never called
    ? Promise.resolve().then(() => getBinarySync(path))
    : readAsync(path)...;
}
```

The `renderChunk` hook in `inlineTreeSitterWasm` matches the emscripten module
init line (present in Rollup's output before esbuild minifies it):

```
var Module = typeof Module != "undefined" ? Module : {};
```

and injects `Module['wasmBinary'] = new Uint8Array(atob("…").split("").map(…))`
immediately after it. By the time emscripten reaches `getBinaryPromise`, the
local `wasmBinary` is already set and `fetch()` is never called.

---

## Grammar WASMs — `Language.load()` binaries

### The problem

The apidom yaml/json adapter packages import their grammar WASMs as ES modules:

```js
// @swagger-api/apidom-parser-adapter-yaml-1-2/src/lexical-analysis/browser.mjs
import treeSitterYaml from '../../wasm/tree-sitter-yaml.wasm';
// ...
await Language.load(treeSitterYaml);
```

`@rollup/plugin-wasm` converts each `.wasm` import into an async loader
function:

```js
function tree_sitter_yaml_default(imports) {
  return _loadWasmModule(0, null, `<base64-encoded ESM module>`, imports);
}
```

`Language.load()` in `web-tree-sitter` accepts either a **URL string** or a
**`Uint8Array`**. It does NOT accept a function. When given a function it calls
`fetch(fn)`, which stringifies the function and tries to fetch:

```
http://…/function%20tree_sitter_yaml_default(Sn)%20{…}
```

### Why a plain `load` hook does not work

`@rollup/plugin-wasm` has both a `load` hook and a `transform` hook:

```js
// @rollup/plugin-wasm — simplified
load(id) {
  if (!/\.wasm$/.test(id)) return null;
  // reads file, emits asset
},
transform(code, id) {
  if (code && /\.wasm$/.test(id)) {
    // replaces module content with the loader function code
  }
}
```

If a preceding plugin's `load` hook returns valid JavaScript for a `.wasm` id,
`@rollup/plugin-wasm`'s `transform` hook still fires (the id still ends with
`.wasm`) and overwrites the JS with the loader function. The fix must prevent
the `transform` hook from seeing the `.wasm` id at all.

### The fix — `inlineGrammarWasms` in `vite.config.esm.js` / `vite.config.umd.js`

Use `resolveId` to redirect every grammar `.wasm` import to a virtual module ID
that does **not** end with `.wasm`. Because `@rollup/plugin-wasm`'s hooks check
`id.endsWith('.wasm')`, they are completely skipped.

```js
const GRAMMAR_WASM_PREFIX = '\0grammar-wasm:';

const inlineGrammarWasms = () => ({
  name: 'inline-grammar-wasms',
  enforce: 'pre',
  async resolveId(id, importer) {
    if (!id.endsWith('.wasm') || id.includes('tree-sitter.wasm')) return null;
    const resolved = await this.resolve(id, importer, { skipSelf: true });
    if (!resolved) return null;
    // ':inline' suffix ensures the virtual id does NOT end with '.wasm'
    return GRAMMAR_WASM_PREFIX + resolved.id + ':inline';
  },
  load(id) {
    if (!id.startsWith(GRAMMAR_WASM_PREFIX)) return null;
    const filePath = id.slice(GRAMMAR_WASM_PREFIX.length, -':inline'.length);
    const wasmBase64 = readFileSync(filePath).toString('base64');
    return `const bytes=new Uint8Array(atob("${wasmBase64}").split("").map(function(c){return c.charCodeAt(0)}));export default bytes;`;
  },
});
```

The virtual module exports a `Uint8Array` of the raw WASM bytes. When
`Language.load(bytes)` is called, it detects a `Uint8Array` input and
instantiates it directly — no fetch needed.

**Note:** `tree-sitter.wasm` is explicitly excluded from this plugin
(`id.includes('tree-sitter.wasm')` check) because the emscripten runtime
handles it separately via the `Module.wasmBinary` injection above.

---

## Plugin ordering in the apidom worker configs

```
vite plugins (plugins: []):
  1. inlineTreeSitterWasm  — renderChunk: injects Module.wasmBinary after emscripten init
  2. inlineGrammarWasms    — resolveId/load: redirects grammar WASMs to Uint8Array modules

rollupOptions.plugins: []:
  3. wasmPlugin({ targetEnv: 'auto-inline' })  — handles tree-sitter.wasm only
                                                  (grammar WASMs already consumed)
```

`inlineGrammarWasms` must be a **Vite plugin** (in the `plugins` array), not a
Rollup plugin (in `rollupOptions.plugins`). Rollup plugins run after Vite's
transform pipeline and after `@rollup/plugin-wasm`, so placing
`inlineGrammarWasms` in `rollupOptions.plugins` alongside `wasmPlugin` does not
give it priority.

---

## Verification after a build

```js
// Check tree-sitter.wasm is inlined (Module.wasmBinary injection present)
grep -c "Module.wasmBinary=new Uint8Array" dist/esm/apidom.worker.js  // → 1

// Check grammar WASMs are Uint8Arrays, not loader functions
grep -c "tree_sitter_yaml_default\|tree_sitter_json_default" dist/esm/apidom.worker.js  // → 0

// Language.load should receive bytes$N (Uint8Array), not a function
grep "Language.load(" dist/esm/apidom.worker.js  // → Language.load(bytes$1)
```
