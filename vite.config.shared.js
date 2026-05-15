import { createLogger } from 'vite';
import { resolve, dirname } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const logger = createLogger();
const loggerWarn = logger.warn.bind(logger);
logger.warn = (msg, options) => {
  if (msg.includes('has been externalized for browser compatibility')) return;
  loggerWarn(msg, options);
};

export const sharedOnwarn = (warning, warn) => {
  // Monaco VSCode API uses import.meta.url guarded by globalThis.location?.href — safe to ignore.
  if (warning.code === 'EMPTY_IMPORT_META') return;
  // web-tree-sitter uses direct eval internally — cannot be changed.
  if (warning.code === 'EVAL') return;
  warn(warning);
};

// Handles all three WASMs in two phases:
//
// resolveId/load — redirects every .wasm import to a virtual module that exports
//   a Uint8Array of the raw bytes. The virtual id does NOT end with '.wasm', so
//   any downstream plugin that checks id.endsWith('.wasm') is bypassed entirely.
//   Grammar WASMs (yaml/json) are consumed by Language.load(bytes) directly.
//   tree-sitter.wasm's exported value is unused; emscripten reads Module.wasmBinary.
//
// renderChunk — patches the final IIFE to inject Module['wasmBinary'] immediately
//   after emscripten's module init line. emscripten's getBinaryPromise() checks
//   wasmBinary first and short-circuits before any fetch() call.
const WASM_INLINE_PREFIX = '\0wasm-inline:';

export const inlineAllWasms = () => {
  const treeSitterWasmPath = resolve(__dirname, 'node_modules/web-tree-sitter/tree-sitter.wasm');
  const treeSitterBase64 = readFileSync(treeSitterWasmPath).toString('base64');

  return {
    name: 'inline-all-wasms',
    enforce: 'pre',

    async resolveId(id, importer) {
      if (!id.endsWith('.wasm')) return null;
      const resolved = await this.resolve(id, importer, { skipSelf: true });
      if (!resolved) return null;
      // ':inline' suffix ensures the virtual id does NOT end with '.wasm'.
      return WASM_INLINE_PREFIX + resolved.id + ':inline';
    },

    load(id) {
      if (!id.startsWith(WASM_INLINE_PREFIX)) return null;
      const filePath = id.slice(WASM_INLINE_PREFIX.length, -':inline'.length);
      const base64 = readFileSync(filePath).toString('base64');
      return `const bytes=new Uint8Array(atob("${base64}").split("").map(function(c){return c.charCodeAt(0)}));export default bytes;`;
    },

    renderChunk(code) {
      // Inject Module['wasmBinary'] at emscripten's module init so getBinaryPromise()
      // returns the binary directly without calling fetch().
      const updated = code.replace(
        /var Module\s*=\s*typeof Module\s*!=\s*["']undefined["']\s*\?\s*Module\s*:\s*\{\}/,
        (match) =>
          `${match};Module['wasmBinary']=new Uint8Array(atob("${treeSitterBase64}").split("").map(function(c){return c.charCodeAt(0)}))`
      );
      return updated !== code ? { code: updated } : null;
    },
  };
};
