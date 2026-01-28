import { readFileSync } from 'fs';

/**
 * Plugin to inline WASM files as base64 data URLs
 * This matches the webpack behavior of using asset/inline for WASM
 *
 * This is a JavaScript version for use in build scripts.
 * The TypeScript version (wasmInline.ts) is used in Vite config files.
 */
export const wasmInlinePlugin = () => {
  return {
    name: 'vite-plugin-wasm-inline',
    enforce: 'pre',

    async load(id) {
      // Handle WASM files
      if (id.endsWith('.wasm')) {
        try {
          // Read WASM file as buffer
          const buffer = readFileSync(id);

          // Convert to base64
          const base64 = buffer.toString('base64');

          // Create data URL
          const dataUrl = `data:application/wasm;base64,${base64}`;

          // Return as module export
          return {
            code: `export default "${dataUrl}";`,
            map: null,
          };
        } catch (error) {
          console.error(`Failed to inline WASM file: ${id}`, error);
          throw error;
        }
      }
      return null;
    },

    // Also handle dynamic imports of WASM
    transform(code, id) {
      // Skip node_modules for performance
      if (id.includes('node_modules') && !code.includes('.wasm')) {
        return null;
      }

      // Look for WASM imports
      const wasmImportRegex = /import\s+(\w+)\s+from\s+['"]([^'"]+\.wasm)['"]/g;
      let match;
      let hasWasmImport = false;

      while ((match = wasmImportRegex.exec(code)) !== null) {
        hasWasmImport = true;
      }

      if (hasWasmImport) {
        // Let Vite handle the import resolution
        return null;
      }

      return null;
    },
  };
};
