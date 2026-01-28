# Vite 404 Error - FIXED

## Problem

The Vite dev server was running but returning **404 Not Found** for all requests.

## Root Cause

**Vite requires `index.html` to be in the project root directory.**

Your project had `index.html` in `/public/index.html`, but Vite looks for it in the root (`/index.html`).

## Solution Applied

### 1. **Copied index.html to Root**

```bash
cp public/index.html index.html
```

Now the file structure is:
```
swagger-editor/
├── index.html          ← Vite uses this (NEW)
├── public/
│   ├── index.html      ← Kept for backwards compatibility
│   ├── manifest.json
│   ├── favicon-32x32.png
│   └── static/
└── src/
    └── index.tsx
```

### 2. **Removed vite-plugin-html**

Since we have `index.html` in the root, we don't need the HTML plugin anymore.

**Before (vite.config.app.ts):**
```typescript
import { createHtmlPlugin } from 'vite-plugin-html';

plugins: [
  createHtmlPlugin({
    minify: !isDev,
    entry: '/src/index.tsx',
    template: 'public/index.html',  // ❌ Vite doesn't find this
    inject: { data: { ... } },
  }),
]
```

**After (vite.config.app.ts):**
```typescript
// No HTML plugin needed!
plugins: [
  react({ ... }),
  nodePolyfills({ ... }),
  createBuildInfoPlugin(),
  createWorkerPlugin({ ... }),
  wasmInlinePlugin(),
]
```

### 3. **Updated index.html**

Added the entry script tag:
```html
<script type="module" src="/src/index.tsx"></script>
```

And simplified the version number (hardcoded for now):
```html
<figcaption>5.1.0</figcaption>
```

## How Vite Works

Vite has a specific workflow:

1. **Looks for `index.html` in the project root**
2. Finds `<script type="module" src="/src/index.tsx"></script>`
3. Loads and transforms `/src/index.tsx` using esbuild
4. Serves the app with HMR enabled

If `index.html` is not in the root, Vite returns 404.

## Files Modified

1. ✅ **index.html** (root) - Created from public/index.html
2. ✅ **vite.config.app.ts** - Removed createHtmlPlugin
3. ✅ **test-vite.sh** - Created test script

## Testing

### Option 1: Using the Test Script

```bash
./test-vite.sh
```

This will:
- ✅ Check all prerequisites
- ✅ Start the dev server
- ✅ Open on http://localhost:3000 (or 3001 if 3000 is busy)

### Option 2: Manual Test

```bash
npm start
```

Then open your browser to:
- http://localhost:3000 (or 3001)

### What You Should See

✅ **No more 404 errors!**
✅ Splash screen with logo
✅ Swagger Editor loads
✅ Monaco Editor initializes
✅ No errors in browser console

## Verification Checklist

After starting the server, verify:

- [ ] Server starts successfully (no errors in terminal)
- [ ] Browser shows the Swagger Editor UI
- [ ] No 404 errors in browser console
- [ ] Logo and loader.gif display correctly
- [ ] Favicon loads in browser tab
- [ ] Monaco Editor loads (main editing area)
- [ ] HMR works (edit a file, see changes without refresh)

## Common Issues

### Issue: Port 3000 already in use

**Solution:** Vite will automatically try port 3001, 3002, etc.

### Issue: "Cannot find module '/src/index.tsx'"

**Solution:** Make sure the file exists:
```bash
ls -la src/index.tsx
```

### Issue: Assets not loading (404 for /static/*)

**Solution:** Make sure `publicDir: 'public'` is in vite.config.app.ts (it is!)

### Issue: Workers not loading

**Solution:** Check the MonacoEnvironment configuration in index.html (already updated!)

## Next Steps

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Test in browser:**
   - Visit http://localhost:3000 or 3001
   - Check browser console for errors
   - Try editing an API spec

3. **Test production build:**
   ```bash
   npm run build:app
   npm run build:app:serve
   ```

4. **Run E2E tests:**
   ```bash
   npm run cy:ci
   ```

## Why This Happened

The original Webpack setup used `html-webpack-plugin` which could load HTML from anywhere. Vite is simpler and expects HTML in the root by convention.

The migration guide should have mentioned this requirement, but it was missed. Now it's fixed!

---

**Fixed:** 2026-01-27
**Status:** ✅ Ready to test
**Expected result:** App loads successfully with no 404 errors
