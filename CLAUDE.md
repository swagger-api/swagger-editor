# CLAUDE.md - SwaggerEditor AI Guide

**Version:** 5.0.6 | **Updated:** 2026-01-21

## Project Overview

**What:** Browser-based API spec editor supporting OpenAPI 2.0/3.0/3.1, AsyncAPI 2.x, JSON Schema
**Stack:** React 17+, SwaggerUI plugin architecture, Monaco Editor (@codingame/monaco-vscode-api), ApiDOM, Immutable.js, Webpack 5, Jest, Cypress
**Philosophy:** Plugin-based architecture, minimal over-engineering, heavy E2E testing, gradual TypeScript adoption (`@ts-strict-ignore`), builds to app/ESM/UMD

## Codebase Structure

```
swagger-editor/
├── src/                    # 267 files
│   ├── App.tsx            # Main component & plugin composition
│   ├── index.tsx          # Browser entry
│   ├── plugins/           # 26 plugins (4 categories below)
│   ├── presets/           # monaco (default), textarea (fallback)
│   ├── styles/            # Global SCSS
│   └── types/             # TypeScript definitions
├── test/cypress/e2e/      # 13 E2E test specs
├── config/webpack/        # Webpack configs
├── scripts/               # Build scripts
├── public/                # Static assets
├── build/                 # Production app (generated)
└── dist/                  # ESM/UMD bundles (generated)
```

## Plugin Architecture

**4 Categories of 26 Plugins:**

1. **Editor Implementations** (4): `editor-textarea`, `editor-monaco`, `editor-monaco-language-apidom`, `editor-monaco-yaml-paste`
2. **Preview Renderers** (4): `editor-preview`, `editor-preview-swagger-ui`, `editor-preview-asyncapi`, `editor-preview-api-design-systems`
3. **Editor Support** (6): `editor-content-type`, `editor-content-persistence`, `editor-content-read-only`, `editor-content-origin`, `editor-content-fixtures`, `editor-content-from-file`
4. **Generic Features** (12): `layout`, `top-bar`, `modals`, `dialogs`, `dropdown-menu`, `dropzone`, `splash-screen`, `editor-safe-render`, `swagger-ui-adapter`, `util`, `versions`, `props-change-watcher`

**Plugin Structure:**
```javascript
const PluginName = ({ getSystem }) => ({
  afterLoad: function,                    // Lifecycle hook
  components: { ComponentName: Comp },    // Register components
  wrapComponents: { Comp: WrapperFn },    // Enhance components
  rootInjects: { utilName: fn },          // Root utilities
  statePlugins: {                         // Redux-like state
    pluginKey: { actions, reducers, selectors, wrapActions }
  },
  fn: { utilityFn: function }             // Utilities
});
```

**System Access:**
```javascript
const { getComponent, editorActions, editorSelectors, fn } = system;
const MonacoEditor = getComponent('MonacoEditor');
const content = editorSelectors.selectEditorContent();
editorActions.setEditorContent('new content');
```

## Development Workflow

**Setup:**
```bash
npm install && npm start  # Dev server on :3000
```

**Key Scripts:**
- `npm start` - Dev server (:3000)
- `npm test` - Jest tests (watch)
- `npm run lint:fix` - Fix ESLint issues
- `npm run build` - Build all (app + bundles + types)
- `npm run build:app:serve` - Serve built app (:3050)
- `npm run cy:dev` - Cypress E2E (interactive)
- `npm run cy:ci` - Cypress CI

**Build Artifacts:**
- **App** (`/build`): Standalone HTML/CSS/JS
- **ESM** (`/dist/esm`): For modern bundlers
- **UMD** (`/dist/umd`): Browser `<script>` tag
- **Types** (`/dist/types`): TypeScript definitions

**Environment Variables (`.env`):**
- `REACT_APP_DEFINITION_FILE` - Local file (in `/public/static`)
- `REACT_APP_DEFINITION_URL` - Remote URL (takes precedence)
- `REACT_APP_APIDOM_WORKER_FILENAME` - ApiDOM worker
- `REACT_APP_EDITOR_WORKER_FILENAME` - Monaco worker

**Web Workers:** Set `MonacoEnvironment` before rendering:
```javascript
self.MonacoEnvironment = { baseUrl: `${document.baseURI}dist/` };
```

## Testing

**Jest (Unit):**
- Location: `src/**/*.{spec,test}.{js,jsx,ts,tsx}`
- Run: `npm test`
- ⚠️ Only 1 test exists (`ValidationPane.test.jsx`), relies on E2E

**Cypress (E2E):**
- Location: `test/cypress/e2e/*.cy.js`
- Run: `npm run cy:dev` (interactive) or `npm run cy:ci` (headless)
- 13 test files covering plugins comprehensively

## Code Style

**ESLint:** Extends Airbnb, React, Cypress, a11y, Prettier, TypeScript
**Prettier:** 100 cols, 2 spaces, single quotes, trailing commas

**Key Rules:**
- ✅ Always include file extensions: `import Comp from './Comp.jsx'` (except TS files)
- ✅ Arrow functions for components: `const Comp = () => {}`
- ✅ Import order: external (with newline) → internal
- ✅ JSX only in `.jsx`/`.tsx` files
- Fix: `npm run lint:fix`

**Commit Format (Conventional Commits):**
```
<type>(<scope>): <subject>  # Max 69 chars
```
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`

**File Naming:**
- Components: `PascalCase.jsx`
- Utilities: `kebab-case.js`
- Styles: `_kebab-case.scss`
- Tests: `ComponentName.test.jsx`
- Cypress: `feature.cy.js`

**TypeScript:** Gradual adoption, strict off globally, use `typescript-strict-plugin`, new files should be strict

## State Management

**Redux-like with Immutable.js:**

**Actions:**
```javascript
export const ACTION = 'plugin_action';
export const myAction = (payload) => ({ type: ACTION, payload });
```

**Reducers:**
```javascript
import { Map } from 'immutable';
export const initialState = Map({ data: null, status: 'idle' });
const myReducer = (state, action) => state.set('data', action.payload);
export default { [ACTION]: myReducer };
```

**Selectors (use Reselect):**
```javascript
import { createSelector } from 'reselect';
export const selectData = (state) => state.get('myPlugin').get('data');
export const selectDerived = createSelector(selectData, (data) => data?.filter(...));
```

**Component Usage:**
```javascript
const { editorSelectors, editorActions } = useSystem();
const content = editorSelectors.selectEditorContent();
editorActions.setEditorContent('new');
```

**Request ID Pattern (prevent race conditions):**
```javascript
const requestId = generateRequestId();
// In action: { type: ACTION, meta: { requestId } }
// In reducer: if (state.get('requestId') !== requestId) return state;
```

## Critical Gotchas

1. **File Extensions:** Always include `.jsx` in imports (except TS)
2. **Immutable.js:** Use `state.set('key', val)` or `state.merge({...})`, never mutate
3. **Component Wrappers:** Return new component: `(Original, sys) => (props) => <Original {...props} />`
4. **Request IDs:** Always use for async ops to prevent race conditions
5. **Monaco Setup:** Set `self.MonacoEnvironment.baseUrl` BEFORE rendering
6. **Worker Paths:** Copy workers to `/dist` or build separately
7. **OOM Errors:** Use `NODE_OPTIONS=--max_old_space_size=4096` for builds
8. **Content Type Detection:** Order matters, specific patterns first
9. **Selector Memoization:** Always use `createSelector` for derived state
10. **Performance:** Editor content in `spec` plugin causes lag on large files - debounce validation

## Key Files

**Core:** `/src/App.tsx`, `/src/index.tsx`, `/public/index.html`
**Config:** `/package.json`, `/tsconfig.json`, `/.eslintrc`, `/.prettierrc`, `/.commitlintrc.json`
**Build:** `/config/webpack.config.js`, `/scripts/{start,build}.js`
**Tests:** `/test/setupTests.js`, `/test/cypress/e2e/*.cy.js`, `/cypress.config.js`
**Plugins:** `/src/plugins/[plugin-name]/` (26 total, see architecture section)
**Presets:** `/src/presets/monaco/`, `/src/presets/textarea/`

## Quick Reference

**Fix Bug:**
1. Identify affected plugin(s)
2. Check E2E test: `test/cypress/e2e/plugin.<name>.cy.js`
3. Review actions/reducers/selectors
4. Test locally: `npm start`
5. Add E2E test to prevent regression

**Add Feature:**
1. Identify affected plugins or create new
2. Plan state management (actions/reducers/selectors)
3. Consider component wrapping vs new components
4. Write E2E test first (TDD)
5. Update README if user-facing

**Refactor:**
1. Follow established patterns
2. Preserve plugin boundaries
3. Maintain immutability (Immutable.js)
4. Keep selectors memoized (`createSelector`)
5. Run tests: `npm test && npm run cy:ci`
6. Lint: `npm run lint:fix`

**Before Commit:**
- [ ] `npm run lint:fix`
- [ ] `npm test`
- [ ] `npm run cy:dev` (manual check)
- [ ] Conventional commit format
- [ ] `npm run build` succeeds

## Component Wrapping Example

```javascript
// extensions/editor-preview/wrap-components/Wrapper.jsx
const Wrapper = (Original, system) => {
  const Enhanced = (props) => {
    const { editorSelectors } = system;
    const isOpenAPI = editorSelectors.selectIsContentTypeOpenAPI();
    if (isOpenAPI) return <EditorPreviewSwaggerUI />;
    return <Original {...props} />;
  };
  return Enhanced;
};
```

## Known Issues

**Editor Content Storage:** Content stored in SwaggerUI `spec` plugin causes typing lag on large files (parses on every keystroke). **Solution:** Store in editor plugin, use FSM in preview. **Mitigation:** Debounce validation, avoid unnecessary state updates.

---

**AI Assistant Notes:**
- Read affected plugin code first
- Follow established patterns strictly
- Use Immutable.js correctly
- Add E2E tests for features
- Lint before committing
- Update this file when architecture changes