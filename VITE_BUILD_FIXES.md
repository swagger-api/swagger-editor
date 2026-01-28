# Vite Build Fixes Summary

This document summarizes all the fixes applied to resolve build and runtime errors after migrating to Vite.

## Issues Resolved

### 1. Development Server Errors

#### Issue: `__webpack_hash__` is not defined
**Error:**
```
ReferenceError: __webpack_hash__ is not defined at Object.afterLoad (after-load.js:20:27)
```

**Fix:**
- **File:** `config/vite/plugins/buildInfo.ts`
- **Solution:** Added `BUILD_HASH` property to buildInfo and defined `__webpack_hash__` global for backwards compatibility with webpack-based code in the versions plugin.

```typescript
__webpack_hash__: JSON.stringify(buildInfo.BUILD_HASH)
```

#### Issue: Worker Module Loading Errors
**Error:**
```
Uncaught SyntaxError: Cannot use import statement outside a module
Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/html"
```

**Fixes:**

1. **New File:** `config/vite/plugins/devWorkers.ts`
   - Created a Vite plugin to serve worker files in development mode
   - Handles requests for `/apidom.worker.js` and `/editor.worker.js`
   - Transforms worker files through Vite's dev server so ES6 imports work correctly

2. **Updated:** `src/plugins/editor-monaco/after-load.js`
   - Changed worker type from `'classic'` to `'module'` for ES6 import support
   ```javascript
   { type: 'module' } // Changed from 'classic'
   ```

3. **Updated:** `vite.config.app.ts`
   - Added workers as separate entry points for production builds
   - Configured output so workers are placed in the root directory

### 2. Production Build Errors

#### Issue: Monaco VSCode API Import Resolution
**Error:**
```
[vite]: Rollup failed to resolve import "@codingame/monaco-vscode-api/vscode/vs/base/browser/cssValue"
```

**Fix:**
- **New File:** `config/vite/plugins/monacoResolver.ts`
- **Solution:** Created a custom plugin to resolve Monaco VSCode API internal imports that were missing the `src` directory in their paths.
- Resolves imports like `@codingame/monaco-vscode-api/vscode/vs/...` to `@codingame/monaco-vscode-api/vscode/src/vs/...`

#### Issue: Node.js `fs` Module in Browser Build
**Error:**
```
"readFile" is not exported by "__vite-browser-external"
```

**Fixes:**

1. **New File:** `config/vite/stubs/fs.js`
   - Created a browser stub for Node.js `fs` module functions
   - Provides stub implementations that throw helpful errors

2. **Updated:** `vite.config.app.ts`
   - Added alias to use custom fs stub:
   ```typescript
   fs: resolve(__dirname, 'config/vite/stubs/fs.js')
   ```
   - Added additional polyfills: `http`, `https`, `path`, `zlib`

#### Issue: Circular Chunk Dependencies
**Warnings:**
```
Circular chunk: vendor-swagger -> vendor -> vendor-swagger
Circular chunk: vendor -> vendor-react -> vendor
```

**Fix:**
- **Updated:** `vite.config.app.ts`
- **Solution:** Improved manual chunking logic to be more intelligent and prevent most circular dependencies:

```typescript
manualChunks: (id) => {
  if (id.includes('node_modules')) {
    // Core dependencies - must be separated
    if (id.includes('react/') || id.includes('react-dom/')) {
      return 'vendor-react';
    }
    // Monaco and its dependencies
    if (id.includes('monaco-editor') || id.includes('@codingame/monaco')) {
      return 'vendor-monaco';
    }
    // AsyncAPI and its dependencies
    if (id.includes('@asyncapi') || id.includes('avro-schema-parser') ||
        id.includes('protobuf-schema-parser') || id.includes('openapi-schema-parser')) {
      return 'vendor-asyncapi';
    }
    // Swagger/ApiDOM
    if (id.includes('@swagger-api/apidom') || id.includes('swagger-ui')) {
      return 'vendor-swagger';
    }
    // Everything else
    return 'vendor';
  }
}
```

- Added warning suppression for unavoidable circular chunks
- Suppressed eval warnings from `protobufjs` and `web-tree-sitter` (these are acceptable)

#### Issue: Out of Memory During Build
**Error:**
```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Fixes:**

1. **Updated:** `vite.config.app.ts`
   - Disabled source maps in production builds to reduce memory usage:
   ```typescript
   sourcemap: isDev, // Only in development
   ```

2. **Updated:** `package.json`
   - Increased Node.js memory limit to 8GB for all build scripts:
   ```json
   "build:app": "cross-env NODE_OPTIONS=--max_old_space_size=8192 node scripts/vite-build.js"
   "build:bundle:esm": "... NODE_OPTIONS=--max_old_space_size=8192 ..."
   "build:bundle:umd": "... NODE_OPTIONS=--max_old_space_size=8192 ..."
   ```

## New Files Created

1. `config/vite/plugins/buildInfo.ts` - Build information plugin (updated)
2. `config/vite/plugins/devWorkers.ts` - Development worker server plugin (new)
3. `config/vite/plugins/monacoResolver.ts` - Monaco import resolver plugin (new)
4. `config/vite/plugins/wasmInline.js` - WASM inline plugin (converted from TS to JS for compatibility)
5. `config/vite/stubs/fs.js` - Browser fs stub (new)

## Modified Files

1. `vite.config.app.ts` - Main configuration changes
2. `vite.config.esm.ts` - Updated to use wasmInline.js
3. `vite.config.umd.ts` - Updated to use wasmInline.js
4. `src/plugins/editor-monaco/after-load.js` - Worker type change
5. `package.json` - Memory limit in build scripts
6. `scripts/vite-build-bundle.js` - Uses wasmInline.js for worker builds

## Usage

### Development
```bash
npm start
```

### Production Build
```bash
npm run build        # Full build (app + bundles + types)
npm run build:app    # App only
```

### Build Output
The production build creates:
- `build/` - Standalone application
- `build/apidom.worker.js` - ApiDOM worker (in root)
- `build/editor.worker.js` - Monaco editor worker (in root)
- `build/assets/` - All other JavaScript and CSS files

### Build Performance
- Build time: ~20-25 seconds
- Memory usage: Up to 8GB
- Chunk sizes (gzipped):
  - Monaco: ~1.74 MB
  - Vendor: ~1.24 MB
  - Swagger: ~353 KB
  - React: ~167 KB
  - AsyncAPI: ~160 KB
  - Main: ~88 KB

## Notes

- Source maps are disabled in production to reduce memory usage
- Some circular chunk warnings are unavoidable due to vendor package structure
- eval() usage in `protobufjs` and `web-tree-sitter` is acceptable and suppressed
- Workers must be served from the root directory for proper loading

## Testing

After build, you can test the production build locally:
```bash
npm run build:app:serve
# Opens on http://localhost:3050
```

---

**Date:** 2026-01-28
**Vite Version:** 5.4.21
**Node Version:** 22.22.0
