# WASM Bundling in ESM/UMD Library Builds

The `apidom.worker.js` bundle contains three WASM binaries that must be fully
self-contained — no runtime HTTP fetches — for the worker to function inside a
Webpack-bundled consumer (swagger-editor-plus and similar).

All three WASMs are handled by the `inlineAllWasms` Vite plugin defined in
`vite.config.shared.js` and used by both `vite.config.esm.js` and `vite.config.umd.js`.
See the [Plugin ordering](#plugin-ordering) section for how the three hooks work together.

## The three binaries

| Binary | Source | How it is loaded at runtime |
|--------|--------|-----------------------------|
| `tree-sitter.wasm` | `web-tree-sitter` (emscripten) | Emscripten's own `locateFile()` / `fetch()` machinery |
| `tree-sitter-yaml.wasm` | `@swagger-api/apidom-parser-adapter-yaml-1-2` | `web-tree-sitter` `Language.load(arg)` |
| `tree-sitter-json.wasm` | `@swagger-api/apidom-parser-adapter-json` | `web-tree-sitter` `Language.load(arg)` |

---

## `tree-sitter.wasm` — emscripten runtime binary

### The problem

Naively inlining `tree-sitter.wasm` as a data URI (e.g. by replacing the
`'tree-sitter.wasm'` string literal in the bundle) breaks emscripten's fetch
interception. Tools like `@rollup/plugin-wasm` patch `globalThis.fetch` with an
`endsWith('tree-sitter.wasm')` guard:

```js
globalThis.fetch = (...args) =>
  isString(args[0]) && args[0].endsWith('tree-sitter.wasm')
    ? realFetch(tree_sitter_default, ...)
    : realFetch(...args);
```

If the literal is replaced with a ~250 KB data URI, the `endsWith` condition
becomes `url.endsWith('<250KB data URI>')`. A string always ends with itself, so
when emscripten then calls `fetch(dataUri)`, the broken branch fires and passes
the loader *function* as the URL argument to `realFetch`, producing a request to
`http://…/function%20tree_sitter_default(Sn)%20{…}`.

### The fix — `renderChunk` hook in `inlineAllWasms`

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

The `renderChunk` hook in `inlineAllWasms` matches the emscripten module
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

Without intervention, a WASM plugin such as `@rollup/plugin-wasm` would convert
each `.wasm` import into an async loader function:

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

### Why a plain `load` hook does not work (historical context)

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

<a id="plugin-ordering"></a>
### The fix — `inlineAllWasms` in `vite.config.shared.js`

All three WASMs are handled by a single `inlineAllWasms` Vite plugin (shared
between `vite.config.esm.js` and `vite.config.umd.js` via `vite.config.shared.js`).
It combines three hooks:

```js
const inlineAllWasms = () => {
  const treeSitterBase64 = readFileSync('node_modules/web-tree-sitter/tree-sitter.wasm').toString('base64');
  return {
    name: 'inline-all-wasms',
    enforce: 'pre',

    // Redirect every .wasm import to a virtual id that does NOT end with '.wasm',
    // bypassing any downstream plugin that checks id.endsWith('.wasm').
    async resolveId(id, importer) {
      if (!id.endsWith('.wasm')) return null;
      const resolved = await this.resolve(id, importer, { skipSelf: true });
      if (!resolved) return null;
      return '\0wasm-inline:' + resolved.id + ':inline';
    },

    // Export the raw bytes as a Uint8Array. Language.load(bytes) accepts this directly.
    // For tree-sitter.wasm the exported value is unused — emscripten reads Module.wasmBinary.
    load(id) {
      if (!id.startsWith('\0wasm-inline:')) return null;
      const filePath = id.slice('\0wasm-inline:'.length, -':inline'.length);
      const base64 = readFileSync(filePath).toString('base64');
      return `const bytes=new Uint8Array(atob("${base64}").split("").map(function(c){return c.charCodeAt(0)}));export default bytes;`;
    },

    // Inject Module['wasmBinary'] into the final bundle at emscripten's module
    // init line so getBinaryPromise() short-circuits before fetch() is called.
    renderChunk(code) {
      const updated = code.replace(
        /var Module\s*=\s*typeof Module\s*!=\s*["']undefined["']\s*\?\s*Module\s*:\s*\{\}/,
        (match) => `${match};Module['wasmBinary']=new Uint8Array(atob("${treeSitterBase64}").split("").map(function(c){return c.charCodeAt(0)}))`
      );
      return updated !== code ? { code: updated } : null;
    },
  };
};
```

`inlineAllWasms` must be a **Vite plugin** (in the `plugins` array), not a
Rollup plugin (in `rollupOptions.plugins`). Rollup plugins run after Vite's
transform pipeline, so placing it in `rollupOptions.plugins` would not give it
priority over other WASM-handling plugins.

---

## Verification after a build

```sh
# Check tree-sitter.wasm is inlined (Module.wasmBinary injection present)
grep -c "wasmBinary" dist/esm/apidom.worker.js   # → ≥1
grep -c "wasmBinary" dist/umd/apidom.worker.js   # → ≥1

# Check grammar WASMs are Uint8Arrays, not loader functions
grep -c "tree_sitter_yaml_default\|tree_sitter_json_default" dist/esm/apidom.worker.js  # → 0
grep -c "tree_sitter_yaml_default\|tree_sitter_json_default" dist/umd/apidom.worker.js  # → 0

# Language.load should receive bytes$N (Uint8Array), not a function
grep "Language.load(" dist/esm/apidom.worker.js  # → Language.load(bytes$1)
```
