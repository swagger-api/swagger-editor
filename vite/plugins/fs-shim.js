import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const FS_SHIM_PATH = resolve(__dirname, '../../src/polyfills/fs-shim.js');

// Redirect bare `fs` imports to the browser shim before nodePolyfills() stubs
// the module to an empty object. @asyncapi/parser imports named exports from `fs`
// (guarded by Node.js checks at runtime, but the named export must exist for the
// bundle to link correctly).
export const fsShim = () => ({
  name: 'fs-shim',
  enforce: 'pre',
  resolveId(id) {
    if (id === 'fs') return FS_SHIM_PATH;
    return null;
  },
});
