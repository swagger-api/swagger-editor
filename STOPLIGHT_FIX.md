# Stoplight Package Path Fix

## Error
```
Could not read from file: /Users/robert.hebel/WebstormProjects/swagger-editor/node_modules/@stoplight/ordered-object-literal/dist/index.mjs
```

## Root Cause

The alias in `vite.config.*.ts` was pointing to the wrong path:

**Wrong path (from webpack config):**
```
node_modules/@stoplight/ordered-object-literal/dist/index.mjs
```

**Correct path (actual package structure):**
```
node_modules/@stoplight/ordered-object-literal/src/index.mjs
```

## Package Structure

The `@stoplight/ordered-object-literal` package has this structure:

```
@stoplight/ordered-object-literal/
├── package.json
├── src/
│   ├── index.cjs     ← CommonJS entry
│   ├── index.mjs     ← ES Module entry (we need this)
│   └── index.d.ts    ← TypeScript types
└── (no dist/ directory!)
```

**From package.json:**
```json
{
  "main": "./src/index.cjs",
  "module": "./src/index.mjs",
  "exports": {
    "types": "./src/index.d.ts",
    "import": "./src/index.mjs",
    "require": "./src/index.cjs"
  }
}
```

## Solution

Updated the alias in **all three** Vite config files:

### 1. vite.config.app.ts
```typescript
resolve: {
  alias: {
    '@stoplight/ordered-object-literal': resolve(
      __dirname,
      'node_modules/@stoplight/ordered-object-literal/src/index.mjs'  // ✅ Fixed
    ),
  }
}
```

### 2. vite.config.esm.ts
```typescript
resolve: {
  alias: {
    '@stoplight/ordered-object-literal': resolve(
      __dirname,
      'node_modules/@stoplight/ordered-object-literal/src/index.mjs'  // ✅ Fixed
    ),
  }
}
```

### 3. vite.config.umd.ts
```typescript
resolve: {
  alias: {
    '@stoplight/ordered-object-literal': resolve(
      __dirname,
      'node_modules/@stoplight/ordered-object-literal/src/index.mjs'  // ✅ Fixed
    ),
  }
}
```

## Why This Happened

The webpack configuration had the wrong path (likely a copy-paste error or assumption that the package had a `dist/` directory). The webpack setup might have worked because webpack's resolution algorithm is more forgiving, or the path was never actually used in the webpack build.

Vite is stricter about file paths, so the incorrect alias immediately caused an error.

## Testing

Now start the dev server:

```bash
npm start
```

The error should be gone and the app should load! ✅

---

**Fixed:** 2026-01-27
**Files Modified:** 3 (all vite.config.*.ts files)
**Status:** ✅ Ready to test
