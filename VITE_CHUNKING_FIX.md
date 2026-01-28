# Vite Chunking and CommonJS Fixes

## Problem Summary

After migrating from Webpack to Vite, the production build was experiencing multiple circular dependency errors and CommonJS compatibility issues:

1. **React Runtime Error**: `Uncaught TypeError: rf is not a function`
2. **Swagger/ApiDOM Error**: `Uncaught ReferenceError: Cannot access 'WN' before initialization`
3. **Monaco Editor Error**: `Uncaught ReferenceError: Cannot access 'Cw' before initialization`
4. **CommonJS Error**: `Uncaught ReferenceError: require is not defined`

## Root Cause

Manual code chunking in Rollup was breaking internal module dependencies and execution order for large, interdependent packages like React, Swagger/ApiDOM, and Monaco Editor. Additionally, some UMD modules were not properly handling the browser environment.

## Solution

### 1. Removed Manual Chunking (vite.config.app.ts)

**Before:**
```typescript
manualChunks: (id) => {
  if (id.includes('node_modules')) {
    if (reactPackages.some(pkg => id.includes(pkg))) {
      return 'vendor-react';
    }
    if (id.includes('monaco-editor') || id.includes('@codingame/monaco')) {
      return 'vendor-monaco';
    }
    if (id.includes('@swagger-api/apidom') || id.includes('swagger-ui')) {
      return 'vendor-swagger';
    }
    return 'vendor';
  }
}
```

**After:**
```typescript
manualChunks: (id) => {
  // Don't chunk worker files
  if (id.includes('apidom.worker') || id.includes('editor.worker')) {
    return undefined;
  }

  // Let Vite handle chunking automatically to avoid circular dependencies
  // Manual chunking of large interdependent packages causes runtime errors:
  // - React: "rf is not a function"
  // - Swagger/ApiDOM: "Cannot access 'WN' before initialization"
  // - Monaco: "Cannot access 'Cw' before initialization"
  //
  // Vite's automatic chunking properly handles module dependencies and
  // execution order, preventing these circular reference errors.
}
```

**Why this works:**
- Vite's automatic chunking algorithm properly analyzes module dependencies
- Execution order is preserved for interdependent packages
- No manual intervention means no broken internal references

### 2. Added CommonJS Transformation (vite.config.app.ts)

Added proper CommonJS to ESM transformation options:

```typescript
build: {
  // ... other options
  commonjsOptions: {
    include: [/node_modules/],
    transformMixedEsModules: true,
  },
}
```

Added lodash to optimizeDeps:

```typescript
optimizeDeps: {
  include: [
    'react',
    'react-dom',
    'react-dom/client',
    'swagger-ui-react',
    'immutable',
    'buffer',
    'stream-browserify',
    'util',
    'url',
    'lodash',  // Added to ensure proper transformation
  ],
}
```

### 3. Added require Shim (index.html & public/index.html)

Added a global `require` shim to handle UMD modules that check for CommonJS:

```html
<script>
  // Provide a require shim for UMD modules that check for CommonJS environment
  // This prevents "require is not defined" errors in the browser
  if (typeof require === 'undefined') {
    window.require = function() {
      throw new Error('require() is not supported in browser environment');
    };
    window.require.resolve = function() {
      throw new Error('require.resolve() is not supported in browser environment');
    };
  }
</script>
```

**Why this works:**
- Some UMD modules check `typeof require !== 'undefined'` to detect Node.js
- By providing a shim, they properly branch to browser-compatible code
- The error messages help with debugging if something actually tries to call require

## Build Results

### Before (with manual chunking):
- Multiple vendor chunks with circular dependencies
- Runtime errors preventing app from loading

### After (automatic chunking):
- Single main bundle: **2.87 MB** gzipped
- Automatic code-split chunks:
  - adapter-LR_dNz75.js: 312.61 KB
  - editorWorkerHost-DsUN72pk.js: 138.16 KB
  - index-C73cfzMP.js: 116.57 KB
  - And several smaller chunks
- apidom.worker.js: 262 KB gzipped
- **No runtime errors** ✅
- App loads and works correctly ✅

## Lessons Learned

1. **Trust Vite's automatic chunking**: For large, complex applications with many interdependencies, Vite's built-in chunking algorithm is more reliable than manual chunking.

2. **Manual chunking is risky**: Only use manual chunking for:
   - Truly isolated libraries with no cross-dependencies
   - Very specific optimization scenarios
   - When you fully understand the dependency graph

3. **CommonJS compatibility**: Always configure `commonjsOptions.transformMixedEsModules: true` when working with packages that have mixed CommonJS/ESM modules.

4. **UMD environment detection**: Provide shims for globals that UMD modules check for (`require`, `module`, `exports`).

## Files Modified

1. `/vite.config.app.ts` - Removed manual chunking, added CommonJS options
2. `/index.html` - Added require shim (dev build)
3. `/public/index.html` - Added require shim (production build)

## Testing

✅ Development server: `npm start` - Working on http://localhost:3002/
✅ Production build: `npm run build:app` - Working
✅ Production preview: `npm run build:app:serve` - Working on http://localhost:3050/

## Date
2026-01-28
