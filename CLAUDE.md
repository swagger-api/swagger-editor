# CLAUDE.md - SwaggerEditor Codebase Guide for AI Assistants

**Version:** 5.0.6 | **Last Updated:** 2026-02-27

---

## Project Overview

SwaggerEditor is a browser-based editor for API specifications supporting **OpenAPI 2.0/3.0/3.1**, **AsyncAPI 2.x**, **API Design Systems**, and **JSON Schema**. Built as a React app on SwaggerUI's plugin architecture with a split-pane Monaco Editor interface.

**Core Technologies:** React 17+/18, SwaggerUI React, TypeScript (gradual), Immutable.js, Monaco Editor, ApiDOM, Webpack 5, Jest + Playwright

**Philosophy:** Plugin-based architecture, minimal over-engineering, heavy E2E testing, gradual TypeScript adoption, app/ESM/UMD build artifacts.

---

## Codebase Structure

```
swagger-editor/
├── config/               # Webpack configs (dev, prod, bundle), Jest transforms
├── docs/                 # architecture.md, customization guides, migration guides
├── public/               # Static assets, HTML template
├── scripts/              # Build scripts (start, build, test)
├── src/
│   ├── App.tsx           # Main app component & plugin composition
│   ├── index.tsx         # Browser entry point
│   ├── plugins/          # 26 plugins (see Architecture section)
│   ├── presets/
│   │   ├── monaco/       # Full-featured preset (default)
│   │   └── textarea/     # Lightweight fallback
│   ├── styles/           # Global SCSS (index.scss)
│   └── types/            # TypeScript declarations (*.d.ts)
├── test/
│   ├── playwright/
│   │   ├── e2e/          # Test specs (*.spec.ts)
│   │   ├── fixtures/     # Test data
│   │   ├── helpers/      # Helper functions
│   │   └── tsconfig.json
│   └── setupTests.js     # Jest setup (jest-dom, canvas-mock)
├── build/                # Standalone app (generated)
└── dist/esm|umd|types/   # Library bundles (generated)
```

---

## Architecture & Design Patterns

### Plugin Categories (26 total)

**Editor implementations:**
- `editor-textarea` — HTML `<textarea>` fallback
- `editor-monaco` — Monaco Editor (advanced)
- `editor-monaco-language-apidom` — ApiDOM language support
- `editor-monaco-yaml-paste` — YAML paste transformations

**Preview plugins:**
- `editor-preview` — Base preview component
- `editor-preview-swagger-ui` — OpenAPI rendering
- `editor-preview-asyncapi` — AsyncAPI rendering
- `editor-preview-api-design-systems` — ADS rendering

**Editor support plugins:**
- `editor-content-type` — Auto-detect content type (OpenAPI/AsyncAPI/JSON Schema)
- `editor-content-persistence` — LocalStorage persistence
- `editor-content-read-only` — Read-only mode
- `editor-content-origin` — Track content source (URL, file, user)
- `editor-content-fixtures` — Load example/fixture files
- `editor-content-from-file` — File import

**Generic feature plugins:**
- `layout`, `top-bar`, `modals`, `dialogs`, `dropdown-menu`, `dropzone`, `splash-screen`, `editor-safe-render`, `swagger-ui-adapter`, `util`, `versions`, `props-change-watcher`

### Component Hierarchy

```
App.tsx (SwaggerUI wrapper)
└── SwaggerEditorLayout
    ├── SplashScreen
    ├── TopBar (File/Edit/Generate menus)
    └── Container
        └── Dropzone
            └── SplitPane (resizable)
                ├── EditorPane
                │   ├── EditorPaneBarTop
                │   ├── MonacoEditor / TextareaEditor
                │   └── ValidationPane (errors/warnings)
                └── EditorPreviewPane
                    └── EditorPreviewSwaggerUI / AsyncAPI / ApiDesignSystems
```

### Design Patterns

- **Container/Presenter:** Containers connect to Redux (e.g., `MonacoEditorContainer.jsx`), presenters handle rendering (e.g., `MonacoEditor.jsx`)
- **HOC via `wrapComponents`:** Plugins wrap existing components to enhance without forking
- **`getComponent`:** Dynamically resolve components — `const C = getComponent('MonacoEditor')`
- **FSM for async:** `idle → loading → success/failure` with request ID tracking to prevent race conditions

---

## Plugin System

### Plugin Structure

```javascript
// src/plugins/plugin-name/index.js
const PluginName = ({ getSystem }) => ({
  afterLoad: function,                   // Runs after plugin loads
  components: {
    ComponentName: Component,            // Register new components
  },
  wrapComponents: {
    ComponentName: WrapperFn,            // Wrap/enhance existing components
  },
  rootInjects: {
    utilityName: function,               // Inject utilities into system
  },
  statePlugins: {
    pluginStateKey: {
      actions: {},                       // Action creators
      reducers: {},                      // Immutable.js reducers
      selectors: {},                     // Reselect selectors
      wrapActions: {},                   // Action middleware
    },
  },
  fn: { utilityFunction: function },
});
export default PluginName;
```

### Typical Plugin File Structure

```
plugin-name/
├── index.js
├── actions/index.js
├── reducers.js
├── selectors.js
├── components/ComponentName.jsx
├── components/ComponentName.scss
├── extensions/other-plugin/wrap-components/ComponentWrapper.jsx
├── after-load.js
└── fn.js
```

### Component Wrapping Pattern

```javascript
// extensions/editor-preview/wrap-components/EditorPreviewWrapper.jsx
const EditorPreviewWrapper = (Original, system) => {
  const EnhancedComponent = (props) => {
    const isOpenAPI = system.editorSelectors.selectIsContentTypeOpenAPI();
    if (isOpenAPI) return <EditorPreviewSwaggerUI />;
    return <Original {...props} />;
  };
  return EnhancedComponent; // must return new component, not Original directly
};
export default EditorPreviewWrapper;
```

### System Access in Plugins

```javascript
const MyPlugin = (system) => {
  const { getComponent, editorActions, editorSelectors, fn } = system;
  const content = editorSelectors.selectEditorContent();
  editorActions.setEditorContent('new content');
  const MonacoEditor = getComponent('MonacoEditor');
};
```

---

## Development Workflows

### Prerequisites
- **Node.js** `>=22.11.0`, **npm** `>=10.9.0`, **Python 3.x** (node-gyp), **GLIBC** `>=2.29`
- Optional: Docker or emscripten (for WASM builds)

### npm Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Dev server on port 3000 (hot reload) |
| `npm test` | Jest unit tests (watch mode) |
| `npm run lint` | ESLint on all files |
| `npm run lint:fix` | Auto-fix ESLint errors |
| `npm run build` | Build all artifacts (app + bundles + types) |
| `npm run build:app` | Standalone app → `/build` |
| `npm run build:app:serve` | Serve built app on port 3050 |
| `npm run build:bundle:esm` | ESM bundle → `/dist/esm` |
| `npm run build:bundle:umd` | UMD bundle → `/dist/umd` |
| `npm run build:definitions` | TypeScript definitions → `/dist/types` |
| `npx playwright test` | E2E tests (headless) |
| `npx playwright test --headed` | E2E with browser visible |
| `npx playwright test --ui` | Interactive UI mode |
| `npx playwright test --debug` | Debug mode |
| `npx playwright show-report` | View test report |
| `npm run clean` | Remove `/build` and `/dist` |

### Environment Variables (`.env`, baked into build)

| Variable | Description |
|----------|-------------|
| `REACT_APP_DEFINITION_FILE` | Local file path (must be in `/public/static`) |
| `REACT_APP_DEFINITION_URL` | Remote URL (takes precedence over file) |
| `REACT_APP_VERSION` | App version (from package.json) |
| `REACT_APP_APIDOM_WORKER_FILENAME` | ApiDOM worker filename |
| `REACT_APP_EDITOR_WORKER_FILENAME` | Monaco editor worker filename |

### Web Workers

Two workers handle background processing: `apidom.worker.js` (parsing/validation) and `editor.worker.js` (Monaco ops). Configure Monaco env **before** rendering:

```javascript
self.MonacoEnvironment = { baseUrl: `${document.baseURI || location.href}dist/` };
```

Workers must be accessible at runtime — either build them separately via webpack entry points, or copy pre-built files from `node_modules/swagger-editor/dist/umd/` using CopyWebpackPlugin.

### OOM Fix for Large Builds

```bash
export NODE_OPTIONS="--max_old_space_size=4096"
npm run build
```

---

## Testing Strategy

### Unit Testing (Jest)
- **Location:** `src/**/*.{spec,test}.{js,jsx,ts,tsx}`, run with `npm test`
- ⚠️ Only 1 unit test exists: `ValidationPane.test.jsx` — heavy reliance on E2E

### E2E Testing (Playwright)
- **Location:** `test/playwright/e2e/*.spec.ts`, base URL `http://localhost:3000`
- All tests written in TypeScript with full `@playwright/test` type safety

**Existing test files:** `app.spec.ts`, `plugin.top-bar.spec.ts`, `plugin.editor-monaco.spec.ts`, `plugin.editor-monaco-yaml-paste.spec.ts`, `plugin.dropzone.spec.ts`, `plugin.validation-pane.spec.ts`, `plugin.editor-content-from-file.spec.ts`, `plugin.editor-persistence.spec.ts`, `plugin.editor-preview-*.spec.ts`, and more.

**Helper functions** (`test/playwright/helpers/`):
- Setup: `visitBlankPage()`, `waitForSplashScreen()`, `prepareAsyncAPI()`
- Editor: `typeInEditor()`, `getAllEditorText()`, `selectAllEditorText()`
- Menu: `clickMenu()`, `loadExample()`, `generateServer()`

**E2E test template:**

```typescript
import { test, expect } from '@playwright/test';
import { visitBlankPage, waitForSplashScreen } from '../helpers';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await visitBlankPage(page);
    await waitForSplashScreen(page);
  });

  test('should do something', async ({ page }) => {
    await page.locator('[data-testid="some-element"]').click();
    await expect(page.locator('text=Expected Text')).toBeVisible();
  });
});
```

---

## Code Style & Conventions

### ESLint (Airbnb + Prettier + jsx-a11y + @typescript-eslint)

Key rules:
- **Arrow functions** for named components — not `function` declarations
- **File extensions required** on all JS/JSX imports: `./Component.jsx` ✅ `./Component` ❌ (`.ts`/`.tsx` exempt)
- **JSX only in `.jsx`/`.tsx` files**
- **Import groups:** external/builtin first (blank line), then internal

Fix violations: `npm run lint:fix`

### Prettier
`printWidth: 100`, `tabWidth: 2`, `semi: true`, `singleQuote: true`, `trailingComma: 'es5'`, `endOfLine: 'lf'`

### Commit Messages (Conventional Commits)

```
<type>(<scope>): <subject>      ← max 69 characters
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`

**Scopes:** plugin name (`editor-monaco`, `top-bar`, `validation`) or area (`deps`, `build`, `release`)

Enforced by commitlint via Husky pre-commit hook.

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| React Components | `PascalCase.jsx/tsx` | `MonacoEditor.jsx` |
| Utilities | `kebab-case.js` | `import-url.js` |
| Types | `kebab-case.d.ts` | `system.d.ts` |
| Styles (partials) | `_kebab-case.scss` | `_monaco-editor.scss` |
| Unit Tests | `ComponentName.test.jsx` | `ValidationPane.test.jsx` |
| E2E Tests | `feature.spec.ts` | `plugin.editor-monaco.spec.ts` |

### Styling
- **SCSS** for all component styles; BEM-like naming (`.editor-pane__title`)
- Partial files prefixed with `_`; global styles in `/src/styles/index.scss`

### TypeScript
- Strict mode **off** globally; gradual adoption via `typescript-strict-plugin`
- Legacy files may use `// @ts-strict-ignore` at top; new files should aim for strictness
- `allowJs: false` — TypeScript files only in tsconfig scope
- Path aliases work: `import X from 'plugins/editor-monaco'` ✅

---

## State Management

SwaggerUI's plugin-based Redux-like system with Immutable.js.

### Actions

```javascript
export const SET_EDITOR_CONTENT = 'editor_set_content';
export const setEditorContent = (content) => ({ type: SET_EDITOR_CONTENT, payload: content });

// Async thunk
export const loadDefinition = (url) => async (system) => {
  const { editorActions, fn } = system;
  const requestId = generateRequestId();
  editorActions.loadDefinitionRequest({ url, requestId });
  try {
    const content = await fn.fetchUrl(url);
    editorActions.loadDefinitionSuccess({ content, requestId });
  } catch (error) {
    editorActions.loadDefinitionFailure({ error, requestId });
  }
};
```

### Reducers (Immutable.js)

```javascript
import { Map } from 'immutable';

export const initialState = Map({ content: '', status: 'idle', error: null, requestId: null });

const loadSuccessReducer = (state, action) => {
  if (state.get('requestId') !== action.payload.requestId) return state; // ignore stale
  return state.merge({ status: 'success', content: action.payload.content, error: null });
};

export default {
  [SET_EDITOR_CONTENT]: (state, action) => state.set('content', action.payload),
  [LOAD_DEFINITION_SUCCESS]: loadSuccessReducer,
};
```

### Selectors (Reselect)

```javascript
import { createSelector } from 'reselect';

export const selectEditorState = (state) => state.get('editor');
export const selectEditorContent = (state) => selectEditorState(state).get('content');
export const selectStatus = (state) => selectEditorState(state).get('status');

// Always memoize derived state
export const selectValidationErrors = createSelector(
  selectValidationResults,
  (results) => results.filter((r) => r.severity === 'error')
);
```

### State Access in Components

```javascript
const MyComponent = () => {
  const { editorSelectors, editorActions } = useSystem();
  const content = editorSelectors.selectEditorContent();
  const isLoading = editorSelectors.selectIsLoading();

  return <div>{isLoading ? 'Loading...' : content}</div>;
};
```

### Known Issue: Editor Content Storage

> Editor content is stored in SwaggerUI `spec` plugin, causing parse/resolve/store on every keystroke → typing lag with large specs. **Future fix:** store content in editor plugin with FSM pattern in preview plugins.

- Avoid unnecessary state updates in the editor
- Debounce expensive validation triggers

---

## Common Tasks

### Creating a New Plugin

```javascript
// src/plugins/my-plugin/index.js
const MyPlugin = () => ({
  components: { MyComponent: () => <div>Hello from MyPlugin</div> },
  statePlugins: {
    myPlugin: {
      initialState: Map({ data: null }),
      actions: { myAction: (payload) => ({ type: 'MY_ACTION', payload }) },
      reducers: { MY_ACTION: (state, action) => state.set('data', action.payload) },
      selectors: { selectData: createSelector((s) => s.get('myPlugin'), (s) => s.get('data')) },
    },
  },
});
export default MyPlugin;
```

Then import and add to `App.tsx` or your preset's plugin array.

### Adding a Component Wrapper

```javascript
// src/plugins/my-plugin/extensions/top-bar/wrap-components/TopBarWrapper.jsx
const TopBarWrapper = (Original, system) => {
  const Enhanced = (props) => {
    const showBanner = system.myPluginSelectors.selectShowBanner();
    return (
      <>
        {showBanner && <div className="banner">Important Notice</div>}
        <Original {...props} />
      </>
    );
  };
  return Enhanced;
};
// Register in plugin: wrapComponents: { TopBar: TopBarWrapper }
```

### Adding a New Content Type

```javascript
// Extend detection in editor-content-type plugin (order matters — specific first)
const detectContentType = (content) => {
  if (/^openapi:\s*["']?3\.1/.test(content)) return 'openapi-3-1';
  if (/^openapi:\s*["']?3\.0/.test(content)) return 'openapi-3-0';
  if (/^swagger:\s*["']?2\.0/.test(content)) return 'openapi-2-0';
  if (/^asyncapi:\s*["']?2\./.test(content)) return 'asyncapi-2';
  if (/^myspec:\s*["']?1\.0/.test(content)) return 'myspec-1-0'; // custom
  return 'unknown';
};
```

Then create a preview plugin that wraps `EditorPreview` and conditionally renders based on `editorSelectors.selectEditorContentType()`.

### Adding E2E Tests

```typescript
// test/playwright/e2e/plugin.my-feature.spec.ts
import { test, expect } from '@playwright/test';
import { visitBlankPage, waitForSplashScreen } from '../helpers';

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    await visitBlankPage(page);
    await waitForSplashScreen(page);
  });
  test('should perform action', async ({ page }) => {
    await page.locator('[data-testid="my-button"]').click();
    await expect(page.locator('text=Expected Result')).toBeVisible();
  });
});
```

### Debugging Validation

```javascript
const { editorSelectors } = useSystem();
console.log('markers:', editorSelectors.selectEditorMarkers());
console.log('diagnostics:', editorSelectors.selectDiagnostics());
console.log('content type:', editorSelectors.selectEditorContentType());
console.log('is OpenAPI:', editorSelectors.selectIsContentTypeOpenAPI());
```

---

## Important Gotchas

### 1. File Extensions Required

```javascript
import Component from './Component.jsx';  // ✅
import Component from './Component';      // ❌ fails linting
```
Exception: `.ts`/`.tsx` files may omit extensions due to ESLint overrides.

### 2. Immutable.js State Updates

```javascript
state.data = newValue;           // ❌ mutates state
return state.set('data', val);   // ✅
return state.merge({ a, b });    // ✅ multiple fields
```

### 3. Component Wrapping Return Value

```javascript
const Wrapper = (Original, system) => Original;              // ❌ no enhancement
const Wrapper = (Original, system) => (props) => <Original {...props} />; // ✅
```

### 4. Request ID Race Conditions

Always include `requestId` in async actions and guard in reducers:
```javascript
if (state.get('requestId') !== action.payload.requestId) return state;
```

### 5. Monaco Environment Configuration

Must be set **before** rendering SwaggerEditor:
```javascript
self.MonacoEnvironment = { baseUrl: `${document.baseURI || location.href}dist/` };
ReactDOM.render(<SwaggerEditor />, document.getElementById('root'));
```

### 6. Web Worker Path Issues

Workers must be accessible at runtime — build separately via webpack entries or copy pre-built files with CopyWebpackPlugin.

### 7. Large Bundle / OOM Errors

```bash
export NODE_OPTIONS="--max_old_space_size=4096"
```

### 8. Content Type Detection Order

More specific patterns must come first — detect `3.1` before `3.0`, `3.0` before `2.0`.

### 9. Selector Memoization

```javascript
// ❌ recalculates every render
export const selectErrors = (state) => selectResults(state).filter(r => r.severity === 'error');

// ✅ memoized with createSelector
export const selectErrors = createSelector(selectResults, (r) => r.filter(...));
```

### 10. TypeScript Strict Mode

Off globally. Use `typescript-strict-plugin` per file. New files should aim for strictness (no `@ts-strict-ignore`). Legacy files may have it.

---

## Key Files Reference

**Core:**
| File | Purpose |
|------|---------|
| `/src/App.tsx` | Main component, plugin composition |
| `/src/index.tsx` | Browser entry point |
| `/public/index.html` | HTML template, MonacoEnvironment setup |

**Config:**
| File | Purpose |
|------|---------|
| `/package.json` | Dependencies, scripts, Jest config |
| `/tsconfig.json` | TypeScript compiler options |
| `/.eslintrc` | ESLint rules (Airbnb + Prettier) |
| `/.prettierrc` | Formatting rules |
| `/.commitlintrc.json` | Commit message linting |
| `/config/webpack.config.js` | Webpack configuration |
| `/playwright.config.ts` | Playwright configuration |

**Docs:**
| File | Purpose |
|------|---------|
| `/docs/architecture.md` | High-level architecture overview |
| `/docs/customization/plug-points/` | Plugin customization guides |
| `/docs/migration*.md` | Migration guides from legacy version |

**Testing:**
| File | Purpose |
|------|---------|
| `/test/setupTests.js` | Jest test setup |
| `/test/playwright/e2e/*.spec.ts` | E2E test specs |
| `/test/playwright/helpers/` | Playwright helper functions |

**Plugin Paths:**
- Editor: `/src/plugins/editor-textarea/`, `/src/plugins/editor-monaco/`, `/src/plugins/editor-monaco-language-apidom/`, `/src/plugins/editor-monaco-yaml-paste/`
- Preview: `/src/plugins/editor-preview*/`
- Support: `/src/plugins/editor-content-*/`
- Generic: `/src/plugins/layout/`, `/src/plugins/top-bar/`, `/src/plugins/modals/`, etc.
- Presets: `/src/presets/monaco/` (default), `/src/presets/textarea/`

---

## Quick Reference for AI Assistants

### Fixing a Bug
1. Identify the plugin — most bugs are plugin-specific
2. Check `test/playwright/e2e/plugin.<name>.spec.ts` for existing coverage
3. Review actions/reducers/selectors in that plugin
4. Add an E2E test to prevent regression

### Adding a Feature
1. Identify affected plugins; decide new vs. extend existing
2. Plan state management needs (new actions/reducers?)
3. Use component wrapping to enhance without forking
4. Write E2E test first (TDD preferred); update README if user-facing

### Refactoring
1. Follow established patterns — don't tightly couple plugins
2. Maintain Immutable.js correctness and selector memoization
3. Run: `npm run lint:fix && npm test && npx playwright test`

### When Stuck
1. Read the relevant plugin source — most logic lives there
2. Check `docs/architecture.md` for high-level overview
3. Look at similar plugins for patterns to copy
4. Check Playwright tests to see how features are exercised

### Before Committing
- [ ] `npm run lint:fix`
- [ ] `npm test`
- [ ] `npx playwright test`
- [ ] Commit message: Conventional Commits format, max 69 chars header
- [ ] `npm run build` succeeds

---

**Last Updated:** 2026-02-27 | **Version:** 5.0.6 | Update this file when architecture changes significantly
