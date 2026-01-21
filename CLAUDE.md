# CLAUDE.md - SwaggerEditor Codebase Guide for AI Assistants

**Version:** 5.0.6
**Last Updated:** 2026-01-21
**Purpose:** This document provides AI assistants with comprehensive guidance for understanding, navigating, and contributing to the SwaggerEditor codebase.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Codebase Structure](#codebase-structure)
3. [Architecture & Design Patterns](#architecture--design-patterns)
4. [Plugin System](#plugin-system)
5. [Development Workflows](#development-workflows)
6. [Testing Strategy](#testing-strategy)
7. [Code Style & Conventions](#code-style--conventions)
8. [State Management](#state-management)
9. [Common Tasks](#common-tasks)
10. [Important Gotchas](#important-gotchas)
11. [Key Files Reference](#key-files-reference)

---

## Project Overview

### What is SwaggerEditor?

SwaggerEditor is a modern, browser-based editor for API specifications, supporting:
- **OpenAPI 2.0/3.0/3.1** (Swagger)
- **AsyncAPI 2.x**
- **API Design Systems**
- **JSON Schema**

It's built as a React application on top of SwaggerUI's plugin architecture, featuring a split-pane interface with Monaco Editor for editing and live preview rendering.

### Core Technologies

| Technology | Purpose |
|-----------|---------|
| **React 17+/18** | UI framework with modern hooks |
| **SwaggerUI React** | Base plugin architecture |
| **TypeScript** | Type safety (gradual adoption) |
| **Immutable.js** | Immutable state in Redux |
| **Monaco Editor** | Advanced code editor (via @codingame/monaco-vscode-api) |
| **ApiDOM** | API specification parsing & validation |
| **Webpack 5** | Module bundling |
| **Jest + Cypress** | Testing (unit + e2e) |

### Project Philosophy

- **Plugin-based architecture**: Everything is a plugin
- **Minimal over-engineering**: Only implement what's needed
- **Heavy E2E testing**: Comprehensive Cypress tests per feature
- **Gradual TypeScript adoption**: Using `@ts-strict-ignore` for incremental migration
- **Build artifacts**: Supports app, ESM, and UMD bundles

---

## Codebase Structure

```
swagger-editor/
├── .github/              # GitHub workflows, CI/CD
├── .husky/               # Git hooks (commitlint, lint-staged)
├── config/               # Build configurations
│   ├── webpack/          # Webpack configs (dev, prod, bundle)
│   └── jest/             # Jest transforms (babel, css, file)
├── docs/                 # Documentation
│   ├── architecture.md   # High-level architecture overview
│   ├── customization/    # Plugin customization guides
│   └── migration*.md     # Migration guides from legacy version
├── public/               # Static assets, HTML template
├── scripts/              # Build scripts (start, build, test)
├── src/                  # Source code (267 files)
│   ├── App.tsx           # Main app component & plugin composition
│   ├── index.tsx         # Browser entry point
│   ├── plugins/          # 26 plugins (see Plugin System section)
│   ├── presets/          # Editor presets (textarea, monaco)
│   ├── styles/           # Global SCSS styles
│   └── types/            # TypeScript type definitions
├── test/
│   ├── cypress/          # E2E tests (13 test files)
│   │   ├── e2e/          # Test specs
│   │   ├── fixtures/     # Test data
│   │   └── support/      # Cypress commands
│   └── setupTests.js     # Jest setup
├── build/                # Production app build (generated)
├── dist/                 # Library bundles (generated)
│   ├── esm/              # ES module bundle
│   ├── umd/              # UMD bundle
│   └── types/            # TypeScript definitions
├── package.json          # Dependencies, scripts, config
├── tsconfig.json         # TypeScript configuration
├── .eslintrc             # ESLint rules (Airbnb + Prettier)
├── .prettierrc           # Code formatting rules
└── .commitlintrc.json    # Commit message linting
```

### Source Code Organization (`/src`)

```
src/
├── App.tsx                      # Main SwaggerEditor component export
├── index.tsx                    # Browser mount point
├── plugins/                     # 26 plugins (categories below)
│   ├── [editor-impl]/           # Editor implementations
│   ├── [preview]/               # Preview renderers
│   ├── [editor-support]/        # Editor support features
│   └── [generic]/               # Generic UI features
├── presets/
│   ├── monaco/                  # Full-featured Monaco preset (default)
│   └── textarea/                # Lightweight textarea fallback
├── styles/
│   └── index.scss               # Global styles
└── types/
    └── *.d.ts                   # TypeScript declarations
```

---

## Architecture & Design Patterns

### Plugin Architecture (4 Categories)

SwaggerEditor uses a modular plugin system where each plugin extends SwaggerUI's functionality. Plugins fall into four categories:

#### 1. Editor Implementation Plugins
Provide the actual editing interface.

| Plugin | Description |
|--------|-------------|
| **editor-textarea** | Base editor using HTML `<textarea>` (fallback) |
| **editor-monaco** | Advanced editor with Monaco Editor |
| **editor-monaco-language-apidom** | ApiDOM language support for Monaco |
| **editor-monaco-yaml-paste** | YAML paste transformations |

#### 2. Preview Plugins
Render API specifications into UI components.

| Plugin | Description |
|--------|-------------|
| **editor-preview** | Base preview component |
| **editor-preview-swagger-ui** | OpenAPI rendering with SwaggerUI |
| **editor-preview-asyncapi** | AsyncAPI rendering |
| **editor-preview-api-design-systems** | API Design Systems preview |

#### 3. Editor Support Plugins
Enhance editor implementations with additional capabilities.

| Plugin | Description |
|--------|-------------|
| **editor-content-type** | Auto-detect content type (OpenAPI/AsyncAPI/JSON Schema) |
| **editor-content-persistence** | LocalStorage persistence |
| **editor-content-read-only** | Read-only mode support |
| **editor-content-origin** | Track content source (URL, file, user) |
| **editor-content-fixtures** | Load example/fixture files |
| **editor-content-from-file** | File import functionality |

#### 4. Generic Feature Plugins
Provide UI components and utilities.

| Plugin | Description |
|--------|-------------|
| **layout** | Split-pane resizable layout |
| **top-bar** | Top navigation (File/Edit/Generate menus) |
| **modals** | Modal dialog system |
| **dialogs** | Dialog components |
| **dropdown-menu** | Dropdown menu components |
| **dropzone** | Drag-and-drop file upload |
| **splash-screen** | Loading screen |
| **editor-safe-render** | Error boundary wrapping |
| **swagger-ui-adapter** | Adapts editor plugins for SwaggerUI usage |
| **util** | Utility functions |
| **versions** | Version information display |
| **props-change-watcher** | React prop change monitoring |

### Component Hierarchy

```
App.tsx (SwaggerUI wrapper)
└── SwaggerEditorLayout
    ├── SplashScreen (loading state)
    ├── TopBar (File/Edit/Generate menus)
    └── Container
        └── Dropzone (file upload)
            └── SplitPane (resizable)
                ├── EditorPane
                │   ├── EditorPaneBarTop (title, actions)
                │   ├── MonacoEditor / TextareaEditor
                │   └── EditorPaneBarBottom
                │       └── ValidationPane (errors/warnings)
                └── EditorPreviewPane
                    └── [Preview Component]
                        ├── EditorPreviewSwaggerUI
                        ├── EditorPreviewAsyncAPI
                        └── EditorPreviewApiDesignSystems
```

### Design Patterns

1. **Container/Presenter Pattern**
   - Containers connect to Redux state (e.g., `MonacoEditorContainer.jsx`)
   - Presenters handle rendering (e.g., `MonacoEditor.jsx`)

2. **Higher-Order Components (HOC)**
   - Plugins wrap components to enhance functionality
   - Example: `EditorPreviewWrapper` conditionally renders based on content type

3. **Render Props via `getComponent`**
   - Dynamically resolve components from the plugin system
   - Example: `const Component = getComponent('MonacoEditor')`

4. **React Hooks**
   - Modern hooks throughout: `useState`, `useEffect`, `useMemo`, `useCallback`

5. **Finite State Machines**
   - Async operations follow: `idle → loading → success/failure`
   - Request ID tracking prevents race conditions

---

## Plugin System

### Plugin Structure

Each plugin exports a function that returns a plugin object:

```javascript
// src/plugins/plugin-name/index.js
const PluginName = ({ getSystem }) => ({
  // Lifecycle hooks
  afterLoad: function,           // Runs after plugin loads

  // React components
  components: {
    ComponentName: Component,    // Register new components
  },

  wrapComponents: {              // Wrap/enhance existing components
    ComponentName: WrapperFn,
  },

  // Root-level utilities
  rootInjects: {
    utilityName: function,       // Inject utilities into system
  },

  // State management (Redux-like)
  statePlugins: {
    pluginStateKey: {
      actions: {},               // Action creators
      reducers: {},              // State reducers (Immutable.js)
      selectors: {},             // State selectors (Reselect)
      wrapActions: {},           // Action middleware
    },
  },

  // Utility functions
  fn: {
    utilityFunction: function,
  },
});

export default PluginName;
```

### Typical Plugin File Structure

```
plugin-name/
├── index.js                    # Plugin export
├── actions/                    # Action creators
│   ├── action-name.js
│   └── index.js
├── reducers.js                 # State reducers
├── selectors.js                # State selectors (memoized)
├── components/                 # React components
│   ├── ComponentName.jsx
│   └── ComponentName.scss
├── extensions/                 # Extensions to other plugins
│   └── other-plugin/
│       └── wrap-components/
│           └── ComponentWrapper.jsx
├── after-load.js               # Lifecycle hook
└── fn.js                       # Utility functions
```

### Component Wrapping Pattern

Plugins can wrap existing components to add/modify functionality:

```javascript
// extensions/editor-preview/wrap-components/EditorPreviewWrapper.jsx
const EditorPreviewWrapper = (Original, system) => {
  const EnhancedComponent = (props) => {
    const { editorSelectors } = system;
    const isOpenAPI = editorSelectors.selectIsContentTypeOpenAPI();

    if (isOpenAPI) {
      return <EditorPreviewSwaggerUI />;
    }

    return <Original {...props} />;
  };

  return EnhancedComponent;
};

export default EditorPreviewWrapper;
```

### System Access

Plugins access the system object to interact with other plugins:

```javascript
const MyPlugin = (system) => {
  const { getComponent, getSystem, editorActions, editorSelectors, fn } = system;

  // Get registered components
  const MonacoEditor = getComponent('MonacoEditor');

  // Read state
  const content = editorSelectors.selectEditorContent();

  // Dispatch actions
  editorActions.setEditorContent('new content');

  // Use utility functions
  const result = fn.someUtility();
};
```

### State Plugins

10 plugins manage state:
- `editor`: Core editor state (content, markers, theme)
- `editorContent`: Content management
- `editorTopBar`: Top bar state (URLs, generator lists)
- `validation`: Validation results
- And others...

---

## Development Workflows

### Prerequisites

- **Node.js**: `>=22.11.0` (recommended: latest Node 20.x)
- **npm**: `>=10.9.0`
- **GLIBC**: `>=2.29`
- **Python 3.x** (for node-gyp)
- **Docker** or **emscripten** (for WASM builds)

### Initial Setup

```bash
# Clone repository
git clone https://github.com/swagger-api/swagger-editor.git
cd swagger-editor

# Use correct Node version (if using nvm)
nvm use

# Install dependencies
npm install

# Start development server (port 3000)
npm start
```

### npm Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Development server with hot reload (port 3000) |
| `npm test` | Run Jest unit tests (watch mode) |
| `npm run lint` | Run ESLint on all files |
| `npm run lint:fix` | Auto-fix ESLint errors |
| `npm run build` | Build all artifacts (app + bundles + types) |
| `npm run build:app` | Build standalone app to `/build` |
| `npm run build:app:serve` | Serve built app on port 3050 |
| `npm run build:bundle:esm` | Build ES module bundle to `/dist/esm` |
| `npm run build:bundle:umd` | Build UMD bundle to `/dist/umd` |
| `npm run build:definitions` | Generate TypeScript definitions |
| `npm run cy:dev` | Run Cypress E2E tests (interactive) |
| `npm run cy:ci` | Run Cypress in CI mode |
| `npm run clean` | Remove `/build` and `/dist` |

### Build Artifacts

1. **Standalone App** (`/build`)
   ```bash
   npm run build:app
   npm run build:app:serve  # Serves on http://localhost:3050
   ```
   - Complete application with all assets
   - Self-contained HTML/CSS/JS

2. **ESM Bundle** (`/dist/esm`)
   ```bash
   npm run build:bundle:esm
   ```
   - ES module format for modern bundlers
   - Consumed by 3rd parties integrating SwaggerEditor

3. **UMD Bundle** (`/dist/umd`)
   ```bash
   npm run build:bundle:umd
   ```
   - Universal Module Definition
   - Browser `<script>` tag usage
   - Exposes global `SwaggerEditor` variable

4. **TypeScript Definitions** (`/dist/types`)
   ```bash
   npm run build:definitions
   ```
   - Generated from TypeScript source files

### Environment Variables

Defined in `.env` file, baked into build:

| Variable | Description |
|----------|-------------|
| `REACT_APP_DEFINITION_FILE` | Local file path (must be in `/public/static`) |
| `REACT_APP_DEFINITION_URL` | Remote URL (takes precedence) |
| `REACT_APP_VERSION` | App version (from package.json) |
| `REACT_APP_APIDOM_WORKER_FILENAME` | ApiDOM worker filename |
| `REACT_APP_EDITOR_WORKER_FILENAME` | Monaco editor worker filename |

### Web Workers

Two workers handle background processing:

1. **apidom.worker.js**: ApiDOM parsing, validation, language services
2. **editor.worker.js**: Monaco Editor operations

Configure Monaco environment in your HTML:

```javascript
self.MonacoEnvironment = {
  baseUrl: `${document.baseURI || location.href}dist/`,
};
```

---

## Testing Strategy

### Unit Testing (Jest)

**Configuration:** `package.json` → `jest` section

- **Location:** `src/**/*.{spec,test}.{js,jsx,ts,tsx}`
- **Setup:** `/test/setupTests.js` (jest-dom, canvas-mock)
- **Environment:** jsdom
- **Run:** `npm test` (watch mode)

**Current State:**
- ⚠️ Only 1 unit test exists: `ValidationPane.test.jsx`
- Heavy reliance on E2E tests for coverage

**Writing Unit Tests:**

```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### E2E Testing (Cypress)

**Configuration:** `cypress.config.js`

- **Location:** `test/cypress/e2e/**/*.cy.js`
- **Base URL:** http://localhost:3000
- **Run Interactive:** `npm run cy:dev`
- **Run CI:** `npm run cy:ci`

**Existing Test Files:**
- `app.cy.js` - General app functionality
- `plugin.top-bar.cy.js` - Top bar menu tests
- `plugin.editor-monaco.cy.js` - Monaco editor tests
- `plugin.dropzone.cy.js` - File upload tests
- `plugin.validation-pane.cy.js` - Validation display tests
- And more...

**Writing E2E Tests:**

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should do something', () => {
    cy.get('[data-testid="some-element"]').click();
    cy.contains('Expected Text').should('be.visible');
  });
});
```

**Testing Philosophy:**
- ✅ Comprehensive E2E coverage per plugin
- ✅ Test real user workflows
- ⚠️ Minimal unit tests (consider expanding for complex logic)

---

## Code Style & Conventions

### ESLint Configuration

**Extends:**
- `react-app` + `react-app/jest`
- `airbnb` (React best practices)
- `plugin:cypress/recommended`
- `plugin:jsx-a11y/recommended` (accessibility)
- `prettier` (formatting)
- `plugin:@typescript-eslint/recommended`

**Key Rules:**

```javascript
// Import order with newlines between groups
import React from 'react';           // builtin/external
import PropTypes from 'prop-types';

import { useEditor } from './hooks'; // internal

// File extensions required (except for packages)
import MyComponent from './MyComponent.jsx';  // ✅
import MyComponent from './MyComponent';      // ❌

// Arrow functions for named components
const MyComponent = () => { /* ... */ };      // ✅
function MyComponent() { /* ... */ }          // ❌

// JSX only in .jsx/.tsx files
```

**Fix violations:**
```bash
npm run lint:fix
```

### Prettier Configuration

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "endOfLine": "lf"
}
```

### Commit Message Format

**Convention:** [Conventional Commits](https://www.conventionalcommits.org/)

**Format:**
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Examples:**
```
feat(editor-monaco): add syntax highlighting for AsyncAPI
fix(validation): resolve race condition in validation pipeline
docs(readme): update installation instructions
chore(deps): bump apidom to 1.2.2
test(e2e): add tests for file upload
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (deps, config)
- `perf`: Performance improvements
- `ci`: CI/CD changes

**Scope (optional):**
- Plugin name: `editor-monaco`, `top-bar`, `validation`
- Area: `deps`, `build`, `release`
- Case: camelCase, kebab-case, or UPPER-CASE

**Rules:**
- Header max 69 characters
- Enforced by commitlint via Husky pre-commit hook

### TypeScript Conventions

**Gradual Adoption:**
- Using `typescript-strict-plugin` for incremental strictness
- Files can have `// @ts-strict-ignore` at the top to opt out
- New files should use TypeScript where practical

**Path Aliases:**
```typescript
import EditorPlugin from 'plugins/editor-monaco';        // ✅
import TextareaPreset from 'presets/textarea';           // ✅
import { SystemType } from 'types/system';               // ✅
```

**Configuration Highlights:**
```json
{
  "strict": false,                 // Gradual adoption
  "allowJs": false,                // TypeScript only in tsconfig
  "declaration": true,             // Generate .d.ts files
  "emitDeclarationOnly": true,     // Only output types (Webpack handles JS)
  "jsx": "react"
}
```

### File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| React Components | PascalCase.jsx/tsx | `MonacoEditor.jsx` |
| Utilities | kebab-case.js | `import-url.js` |
| Types | kebab-case.d.ts | `system.d.ts` |
| Styles | kebab-case.scss | `_monaco-editor.scss` |
| Tests | ComponentName.test.jsx | `ValidationPane.test.jsx` |
| Cypress | feature.cy.js | `plugin.editor-monaco.cy.js` |

### Import Conventions

**Always use file extensions:**
```javascript
import Component from './Component.jsx';     // ✅
import Component from './Component';         // ❌
```

**Exception:** TypeScript files can omit extensions due to ESLint overrides.

**Import Groups:**
```javascript
// 1. Builtin/External (newline after)
import React, { useState } from 'react';
import PropTypes from 'prop-types';

// 2. Internal
import EditorPlugin from 'plugins/editor-monaco';
import { useEditor } from './hooks';
```

### Styling Conventions

- **SCSS** for component styles
- **Partial files:** Prefix with underscore (`_component.scss`)
- **BEM-like naming:** `.editor-pane__title`, `.validation-table__row`
- **Scoped styles:** Import in component file
- **Global styles:** `/src/styles/index.scss`

---

## State Management

### Redux-Like Architecture (via SwaggerUI)

SwaggerEditor uses SwaggerUI's plugin-based state management, which resembles Redux with Immutable.js.

### Actions

**Action Types (constants):**
```javascript
export const SET_EDITOR_CONTENT = 'editor_set_content';
export const LOAD_DEFINITION_REQUEST = 'editor_load_definition_request';
export const LOAD_DEFINITION_SUCCESS = 'editor_load_definition_success';
export const LOAD_DEFINITION_FAILURE = 'editor_load_definition_failure';
```

**Action Creators:**
```javascript
export const setEditorContent = (content) => ({
  type: SET_EDITOR_CONTENT,
  payload: content,
});

export const loadDefinitionRequest = (url) => ({
  type: LOAD_DEFINITION_REQUEST,
  payload: url,
  meta: { requestId: generateRequestId() },
});
```

**Async Thunks:**
```javascript
export const loadDefinition = (url) => async (system) => {
  const { editorActions, fn } = system;
  const requestId = generateRequestId();

  editorActions.loadDefinitionRequest(url);

  try {
    const content = await fn.fetchUrl(url);
    return editorActions.loadDefinitionSuccess({ content, requestId });
  } catch (error) {
    return editorActions.loadDefinitionFailure({ error, requestId });
  }
};
```

### Reducers

**Immutable.js Updates:**
```javascript
import { Map } from 'immutable';

export const initialState = Map({
  content: '',
  status: 'idle', // idle | loading | success | failure
  error: null,
  requestId: null,
});

const setEditorContentReducer = (state, action) => {
  return state.set('content', action.payload);
};

const loadDefinitionRequestReducer = (state, action) => {
  return state.merge({
    status: 'loading',
    error: null,
    requestId: action.meta.requestId,
  });
};

const loadDefinitionSuccessReducer = (state, action) => {
  if (state.get('requestId') !== action.payload.requestId) {
    return state; // Ignore outdated response
  }

  return state.merge({
    status: 'success',
    content: action.payload.content,
    error: null,
  });
};

export default {
  [SET_EDITOR_CONTENT]: setEditorContentReducer,
  [LOAD_DEFINITION_REQUEST]: loadDefinitionRequestReducer,
  [LOAD_DEFINITION_SUCCESS]: loadDefinitionSuccessReducer,
  [LOAD_DEFINITION_FAILURE]: loadDefinitionFailureReducer,
};
```

### Selectors

**Basic Selectors:**
```javascript
// Get state slice
export const selectEditorState = (state) => state.get('editor');

// Get specific value
export const selectEditorContent = (state) =>
  selectEditorState(state).get('content');

export const selectStatus = (state) =>
  selectEditorState(state).get('status');
```

**Memoized Selectors (Reselect):**
```javascript
import { createSelector } from 'reselect';

export const selectIsLoading = createSelector(
  selectStatus,
  (status) => status === 'loading'
);

export const selectIsOpenAPI = createSelector(
  selectContentType,
  (contentType) => contentType?.startsWith('openapi-')
);

export const selectValidationErrors = createSelector(
  selectValidationResults,
  (results) => results.filter((r) => r.severity === 'error')
);
```

### State Access in Components

**Using Selectors:**
```javascript
import { useSystem } from 'swagger-ui-react';

const MyComponent = () => {
  const system = useSystem();
  const { editorSelectors, editorActions } = system;

  // Read state
  const content = editorSelectors.selectEditorContent();
  const isLoading = editorSelectors.selectIsLoading();

  // Dispatch actions
  const handleContentChange = (newContent) => {
    editorActions.setEditorContent(newContent);
  };

  return (
    <div>
      {isLoading ? 'Loading...' : content}
    </div>
  );
};
```

### Request ID Pattern

Prevents race conditions in async operations:

```javascript
// Action includes request ID
const requestId = generateRequestId();
editorActions.loadDefinition({ url, requestId });

// Reducer ignores outdated responses
if (state.get('requestId') !== action.payload.requestId) {
  return state; // This response is outdated, ignore it
}
```

### Known State Management Issue

**From `docs/architecture.md`:**

> Currently, editor content (text) is stored in SwaggerUI `spec` plugin. This causes issues with typing lag on large content because the `spec` plugin tries to parse, resolve, and store content in Redux on every change. **Future improvement:** Store editor content in editor plugin and use FSM pattern in preview plugins.

**What this means for AI assistants:**
- Be aware of potential performance issues with large API specs
- Avoid unnecessary state updates in the editor
- Consider debouncing validation triggers

---

## Common Tasks

### 1. Creating a New Plugin

**Step 1:** Create plugin directory structure
```bash
mkdir -p src/plugins/my-plugin/components
touch src/plugins/my-plugin/index.js
```

**Step 2:** Define plugin
```javascript
// src/plugins/my-plugin/index.js
const MyPlugin = ({ getSystem }) => ({
  components: {
    MyComponent: () => <div>Hello from MyPlugin</div>,
  },

  statePlugins: {
    myPlugin: {
      actions: {
        myAction: (payload) => ({ type: 'MY_ACTION', payload }),
      },
      reducers: {
        MY_ACTION: (state, action) => state.set('data', action.payload),
      },
      selectors: {
        selectData: (state) => state.get('data'),
      },
    },
  },
});

export default MyPlugin;
```

**Step 3:** Add to preset or App.tsx
```javascript
import MyPlugin from 'plugins/my-plugin';

const plugins = [
  // ... other plugins
  MyPlugin,
];
```

### 2. Adding a Component Wrapper

**Example:** Enhance an existing component

```javascript
// src/plugins/my-plugin/extensions/top-bar/wrap-components/TopBarWrapper.jsx
const TopBarWrapper = (Original, system) => {
  const EnhancedTopBar = (props) => {
    const { myPluginSelectors } = system;
    const showBanner = myPluginSelectors.selectShowBanner();

    return (
      <>
        {showBanner && <div className="banner">Important Notice</div>}
        <Original {...props} />
      </>
    );
  };

  return EnhancedTopBar;
};

export default TopBarWrapper;
```

**Register in plugin:**
```javascript
import TopBarWrapper from './extensions/top-bar/wrap-components/TopBarWrapper.jsx';

const MyPlugin = () => ({
  wrapComponents: {
    TopBar: TopBarWrapper,
  },
});
```

### 3. Adding State Management to a Plugin

**actions/index.js:**
```javascript
export const ACTION_TYPE = 'my_plugin_action';

export const myAction = (payload) => ({
  type: ACTION_TYPE,
  payload,
});
```

**reducers.js:**
```javascript
import { Map } from 'immutable';
import { ACTION_TYPE } from './actions/index.js';

export const initialState = Map({
  data: null,
});

const myActionReducer = (state, action) => {
  return state.set('data', action.payload);
};

export default {
  [ACTION_TYPE]: myActionReducer,
};
```

**selectors.js:**
```javascript
import { createSelector } from 'reselect';

export const selectMyPluginState = (state) => state.get('myPlugin');

export const selectData = createSelector(
  selectMyPluginState,
  (state) => state.get('data')
);
```

**index.js:**
```javascript
import reducers, { initialState } from './reducers.js';
import * as actions from './actions/index.js';
import * as selectors from './selectors.js';

const MyPlugin = () => ({
  statePlugins: {
    myPlugin: {
      initialState,
      actions,
      reducers,
      selectors,
    },
  },
});

export default MyPlugin;
```

### 4. Adding E2E Tests

**Create test file:**
```javascript
// test/cypress/e2e/my-feature.cy.js
describe('My Feature', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid="splash-screen"]').should('not.exist'); // Wait for load
  });

  it('should perform action', () => {
    cy.get('[data-testid="my-button"]').click();
    cy.contains('Expected Result').should('be.visible');
  });
});
```

**Run tests:**
```bash
npm run cy:dev  # Interactive
npm run cy:ci   # Headless
```

### 5. Debugging Validation Issues

**Access validation state:**
```javascript
const { editorSelectors } = useSystem();
const markers = editorSelectors.selectEditorMarkers();
const diagnostics = editorSelectors.selectDiagnostics();

console.log('Validation markers:', markers);
console.log('Diagnostics:', diagnostics);
```

**Check content type detection:**
```javascript
const contentType = editorSelectors.selectEditorContentType();
const isOpenAPI = editorSelectors.selectIsContentTypeOpenAPI();

console.log('Detected type:', contentType);
console.log('Is OpenAPI?', isOpenAPI);
```

### 6. Adding a New Content Type

**Extend content type detection:**
```javascript
// In editor-content-type plugin
const detectContentType = (content) => {
  // Try OpenAPI detection
  if (/^openapi:\s*["']?3\.1/.test(content)) return 'openapi-3-1';
  if (/^openapi:\s*["']?3\.0/.test(content)) return 'openapi-3-0';
  if (/^swagger:\s*["']?2\.0/.test(content)) return 'openapi-2-0';

  // Try AsyncAPI detection
  if (/^asyncapi:\s*["']?2\./.test(content)) return 'asyncapi-2';

  // Add your custom type
  if (/^myspec:\s*["']?1\.0/.test(content)) return 'myspec-1-0';

  // Fallback
  return 'unknown';
};
```

**Create preview plugin:**
```javascript
// plugins/editor-preview-myspec/index.js
const EditorPreviewMySpec = () => ({
  components: {
    EditorPreviewMySpec: MySpecRenderer,
  },

  wrapComponents: {
    EditorPreview: (Original, system) => {
      const EnhancedPreview = (props) => {
        const { editorSelectors, getComponent } = system;
        const contentType = editorSelectors.selectEditorContentType();

        if (contentType === 'myspec-1-0') {
          const Renderer = getComponent('EditorPreviewMySpec');
          return <Renderer />;
        }

        return <Original {...props} />;
      };

      return EnhancedPreview;
    },
  },
});
```

### 7. Customizing Monaco Editor

**Add language support:**
```javascript
// In editor-monaco-language-apidom plugin or create new plugin
import * as monaco from 'monaco-editor';

monaco.languages.register({ id: 'myspec' });

monaco.languages.setMonarchTokensProvider('myspec', {
  tokenizer: {
    root: [
      [/myspec:/, 'keyword'],
      [/version:/, 'keyword'],
      // ... more rules
    ],
  },
});

monaco.languages.setLanguageConfiguration('myspec', {
  comments: { lineComment: '#' },
  brackets: [['[', ']'], ['{', '}']],
  // ... more config
});
```

### 8. Working with Web Workers

**ApiDOM Worker (parsing/validation):**
```javascript
// Worker is pre-configured, access via Monaco LS
// See: plugins/editor-monaco-language-apidom
```

**Editor Worker (Monaco operations):**
```javascript
// Automatically handled by Monaco
// Configure via MonacoEnvironment global
```

---

## Important Gotchas

### 1. File Extensions Required

❌ **This will fail linting:**
```javascript
import Component from './Component';
```

✅ **Always include extension:**
```javascript
import Component from './Component.jsx';
```

**Exception:** TypeScript files (`.ts`, `.tsx`) have extensions optional due to ESLint overrides.

### 2. Immutable.js State Updates

❌ **Wrong (mutates state):**
```javascript
state.data = newValue;
return state;
```

✅ **Correct:**
```javascript
return state.set('data', newValue);
```

✅ **Merge multiple fields:**
```javascript
return state.merge({
  data: newValue,
  status: 'success',
});
```

### 3. Component Wrapping Return Value

❌ **Wrong (returns Original directly):**
```javascript
const Wrapper = (Original, system) => {
  return Original; // No enhancement
};
```

✅ **Correct (returns new component):**
```javascript
const Wrapper = (Original, system) => {
  const Enhanced = (props) => {
    // Add logic here
    return <Original {...props} />;
  };
  return Enhanced;
};
```

### 4. Request ID Race Conditions

When performing async operations, always use request IDs:

```javascript
// Generate ID for tracking
const requestId = generateRequestId();

// Include in request action
editorActions.loadDefinition({ url, requestId });

// Check in success/failure reducers
if (state.get('requestId') !== action.payload.requestId) {
  return state; // Ignore outdated response
}
```

### 5. Monaco Environment Configuration

Must be set **before** rendering SwaggerEditor:

```javascript
// BEFORE ReactDOM.render
self.MonacoEnvironment = {
  baseUrl: `${document.baseURI || location.href}dist/`,
};

// THEN render
ReactDOM.render(<SwaggerEditor />, document.getElementById('root'));
```

### 6. Web Worker Path Issues

Workers must be accessible at runtime. Use one of:

**Option A:** Build workers separately (default)
```javascript
// webpack.config.js
entry: {
  'apidom.worker': 'swagger-editor/apidom.worker',
  'editor.worker': 'swagger-editor/editor.worker',
}
```

**Option B:** Copy pre-built workers
```javascript
// webpack.config.js with CopyWebpackPlugin
new CopyWebpackPlugin({
  patterns: [
    { from: 'node_modules/swagger-editor/dist/umd/apidom.worker.js', to: 'dist/' },
    { from: 'node_modules/swagger-editor/dist/umd/editor.worker.js', to: 'dist/' },
  ],
})
```

### 7. Large Bundle Size / OOM Errors

Building with SwaggerEditor can cause:
```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Fix:**
```bash
export NODE_OPTIONS="--max_old_space_size=4096"
npm run build
```

Or in `package.json`:
```json
{
  "scripts": {
    "build": "cross-env NODE_OPTIONS=--max_old_space_size=4096 node scripts/build.js"
  }
}
```

### 8. Content Type Detection Failures

Content type detection relies on regex patterns. If detection fails:

**Check detection order:**
```javascript
// Order matters! More specific patterns first
if (/^openapi:\s*["']?3\.1/.test(content)) return 'openapi-3-1';
if (/^openapi:\s*["']?3\.0/.test(content)) return 'openapi-3-0';
if (/^swagger:\s*["']?2\.0/.test(content)) return 'openapi-2-0';
```

**Test with different content:**
```javascript
const content = `openapi: "3.1.0"\ninfo:\n  title: Test`;
const type = detectContentType(content);
console.log('Detected:', type); // Should be 'openapi-3-1'
```

### 9. Selector Memoization

Always use `createSelector` for derived state to prevent re-renders:

❌ **Without memoization (recalculates every render):**
```javascript
export const selectErrors = (state) => {
  return selectValidationResults(state).filter(r => r.severity === 'error');
};
```

✅ **With memoization (only recalculates when input changes):**
```javascript
export const selectErrors = createSelector(
  selectValidationResults,
  (results) => results.filter(r => r.severity === 'error')
);
```

### 10. TypeScript Strict Mode

Project uses **gradual TypeScript adoption**:
- Not all files are TypeScript
- Strict mode is **off** globally
- Use `typescript-strict-plugin` for per-file strictness

**New TypeScript files should aim for strictness:**
```typescript
// MyComponent.tsx - no @ts-strict-ignore needed
import { FC } from 'react';

interface Props {
  content: string;
}

const MyComponent: FC<Props> = ({ content }) => {
  return <div>{content}</div>;
};

export default MyComponent;
```

**Legacy files may have:**
```typescript
// @ts-strict-ignore
// ... non-strict code
```

---

## Key Files Reference

### Core Application Files

| File | Purpose |
|------|---------|
| `/src/App.tsx` | Main SwaggerEditor component, plugin composition |
| `/src/index.tsx` | Browser entry point, ReactDOM render |
| `/public/index.html` | HTML template, MonacoEnvironment setup |

### Configuration Files

| File | Purpose |
|------|---------|
| `/package.json` | Dependencies, scripts, Jest config |
| `/tsconfig.json` | TypeScript compiler options |
| `/.eslintrc` | ESLint rules (Airbnb + Prettier) |
| `/.prettierrc` | Code formatting rules |
| `/.commitlintrc.json` | Commit message linting rules |
| `/.lintstagedrc` | Pre-commit linting (Husky) |
| `/.nvmrc` | Node.js version |
| `/.browserslistrc` | Browser support targets |

### Build Configuration

| File | Purpose |
|------|---------|
| `/config/webpack.config.js` | Main Webpack configuration |
| `/scripts/start.js` | Development server script |
| `/scripts/build.js` | Production build script |
| `/scripts/build-bundle.js` | Library bundle script |

### Documentation

| File | Purpose |
|------|---------|
| `/README.md` | User-facing documentation |
| `/docs/architecture.md` | High-level architecture overview |
| `/docs/customization/plug-points/` | Plugin customization guides |
| `/docs/migration*.md` | Migration guides from legacy version |
| `/CLAUDE.md` | This file - AI assistant guide |

### Testing

| File | Purpose |
|------|---------|
| `/test/setupTests.js` | Jest test setup |
| `/test/cypress/e2e/*.cy.js` | E2E test specs |
| `/cypress.config.js` | Cypress configuration |

### Plugin Index

**Editor Implementations:**
- `/src/plugins/editor-textarea/`
- `/src/plugins/editor-monaco/`
- `/src/plugins/editor-monaco-language-apidom/`
- `/src/plugins/editor-monaco-yaml-paste/`

**Preview Plugins:**
- `/src/plugins/editor-preview/`
- `/src/plugins/editor-preview-swagger-ui/`
- `/src/plugins/editor-preview-asyncapi/`
- `/src/plugins/editor-preview-api-design-systems/`

**Editor Support:**
- `/src/plugins/editor-content-type/`
- `/src/plugins/editor-content-persistence/`
- `/src/plugins/editor-content-read-only/`
- `/src/plugins/editor-content-origin/`
- `/src/plugins/editor-content-fixtures/`
- `/src/plugins/editor-content-from-file/`

**Generic Features:**
- `/src/plugins/layout/`
- `/src/plugins/top-bar/`
- `/src/plugins/modals/`
- `/src/plugins/dialogs/`
- `/src/plugins/dropdown-menu/`
- `/src/plugins/dropzone/`
- `/src/plugins/splash-screen/`
- `/src/plugins/editor-safe-render/`
- `/src/plugins/swagger-ui-adapter/`
- `/src/plugins/util/`
- `/src/plugins/versions/`
- `/src/plugins/props-change-watcher/`

**Presets:**
- `/src/presets/monaco/` - Full-featured editor (default)
- `/src/presets/textarea/` - Lightweight fallback

---

## Quick Reference for AI Assistants

### When Asked to Fix a Bug

1. **Understand the plugin system** - Most bugs are plugin-specific
2. **Check E2E tests** - Look at `test/cypress/e2e/plugin.<name>.cy.js`
3. **Review state management** - Check actions/reducers/selectors
4. **Test locally** - `npm start` and manually verify
5. **Add E2E test** - Prevent regression

### When Asked to Add a Feature

1. **Identify affected plugins** - Which plugins need changes?
2. **Check if new plugin needed** - Create new vs. extend existing?
3. **Plan state management** - Need new actions/reducers?
4. **Consider component wrapping** - Enhance existing components?
5. **Write E2E tests first** - TDD approach preferred
6. **Update documentation** - Add to README if user-facing

### When Asked to Refactor

1. **Check existing patterns** - Follow established conventions
2. **Preserve plugin boundaries** - Don't tightly couple plugins
3. **Maintain immutability** - Use Immutable.js correctly
4. **Keep selectors memoized** - Use `createSelector`
5. **Run full test suite** - `npm test && npm run cy:ci`
6. **Lint and format** - `npm run lint:fix`

### When Stuck

1. **Read plugin source** - Most logic is in plugins
2. **Check docs/architecture.md** - High-level overview
3. **Look at similar plugins** - Copy patterns from working examples
4. **Check Cypress tests** - See how features are tested
5. **Search for error messages** - May be in reducers/actions

### Before Committing

- [ ] Run `npm run lint:fix`
- [ ] Run `npm test`
- [ ] Run `npm run cy:dev` (manual E2E check)
- [ ] Check commit message format (Conventional Commits)
- [ ] Verify build succeeds: `npm run build`

---

## Architectural Future Improvements

From `docs/architecture.md`:

**Known Issue: Editor Content Storage**

> Currently, editor content is stored in SwaggerUI's `spec` plugin, causing:
> - Parse/resolve operations on every keystroke
> - Typing lag with large specifications
> - Unnecessary Redux updates

**Proposed Solution:**
- Store editor content in editor plugin directly
- Use FSM pattern in preview plugins to decide when to process
- Significantly reduce typing lag

**What this means for AI assistants:**
- Be cautious with state updates involving editor content
- Consider performance implications of validation triggers
- Debounce expensive operations
- This architectural change may happen in future versions

---

## Conclusion

SwaggerEditor is a well-architected, plugin-based editor for API specifications. Key takeaways:

✅ **Plugin-based architecture** - Everything is a plugin
✅ **Four plugin categories** - Editor, Preview, Support, Generic
✅ **Redux-like state** - Actions, reducers, selectors with Immutable.js
✅ **Component wrapping** - Extend existing components without forking
✅ **Heavy E2E testing** - Comprehensive Cypress coverage
✅ **Gradual TypeScript** - Incremental adoption with strict plugin
✅ **Code quality** - ESLint (Airbnb), Prettier, Commitlint, Husky

**Development Philosophy:**
- Minimal over-engineering
- Plugin isolation
- Preserve existing patterns
- E2E test coverage
- Code quality via linting

**For AI Assistants:**
- Always read affected plugin code first
- Follow established patterns
- Use Immutable.js correctly
- Add E2E tests for features
- Lint and format before committing

---

**Last Updated:** 2026-01-21
**SwaggerEditor Version:** 5.0.6
**Maintained By:** AI assistants should update this file when architecture changes significantly
