// Vite >=8.3 parses bare `.wasm` imports as WebAssembly ES modules and fails on the
// emscripten `env` import of the tree-sitter grammars. Keep the previous behavior
// (default export is the asset URL) by redirecting them to `?url`.
export const wasmAsUrl = () => ({
  name: 'wasm-as-url',
  enforce: 'pre',
  async resolveId(id, importer, options) {
    if (!id.endsWith('.wasm')) return null;
    const resolved = await this.resolve(id, importer, { ...options, skipSelf: true });
    return resolved ? `${resolved.id}?url` : null;
  },
});
