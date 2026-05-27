import { resolve, dirname } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const WASM_INLINE_PREFIX = '\0wasm-inline:';
const WASM_INLINE_SUFFIX = ':inline';

const TREE_SITTER_WASM_PATH = resolve(
  __dirname,
  '../../node_modules/web-tree-sitter/tree-sitter.wasm'
);

// Produces a JS expression that decodes a base64 string into a Uint8Array.
// Used both in virtual module bodies (load) and in the emscripten bundle patch (renderChunk).
const uint8ArrayExpr = (base64) =>
  `new Uint8Array(atob("${base64}").split("").map(function(c){return c.charCodeAt(0)}))`;

// Virtual ID helpers — WASM_INLINE_SUFFIX ensures the id does NOT end with '.wasm',
// so downstream plugins that gate on id.endsWith('.wasm') are bypassed entirely.
const toVirtualId = (realPath) => `${WASM_INLINE_PREFIX}${realPath}${WASM_INLINE_SUFFIX}`;
const fromVirtualId = (virtualId) =>
  virtualId.slice(WASM_INLINE_PREFIX.length, -WASM_INLINE_SUFFIX.length);

// Handles all three WASMs in two phases:
//
// resolveId/load — redirects every .wasm import to a virtual module that exports
//   a Uint8Array of the raw bytes.
//   Grammar WASMs (yaml/json) are consumed by Language.load(bytes) directly.
//   tree-sitter.wasm's exported value is unused; emscripten reads Module.wasmBinary.
//
// renderChunk — patches the final IIFE/ESM bundle to inject Module['wasmBinary']
//   immediately after emscripten's module init line. emscripten's getBinaryPromise()
//   checks wasmBinary first and short-circuits before any fetch() call.
export const inlineAllWasms = () => {
  const treeSitterBase64 = readFileSync(TREE_SITTER_WASM_PATH).toString('base64');

  return {
    name: 'inline-all-wasms',
    enforce: 'pre',

    async resolveId(id, importer) {
      if (!id.endsWith('.wasm')) return null;
      const resolved = await this.resolve(id, importer, { skipSelf: true });
      if (!resolved) return null;
      return toVirtualId(resolved.id);
    },

    load(id) {
      if (!id.startsWith(WASM_INLINE_PREFIX)) return null;
      const base64 = readFileSync(fromVirtualId(id)).toString('base64');
      return `const bytes=${uint8ArrayExpr(base64)};export default bytes;`;
    },

    renderChunk(code) {
      // Inject Module['wasmBinary'] at emscripten's module init so getBinaryPromise()
      // returns the binary directly without calling fetch().
      const updated = code.replace(
        /var Module\s*=\s*typeof Module\s*!=\s*["']undefined["']\s*\?\s*Module\s*:\s*\{\}/,
        (match) => `${match};Module['wasmBinary']=${uint8ArrayExpr(treeSitterBase64)}`
      );
      return updated !== code ? { code: updated } : null;
    },
  };
};
