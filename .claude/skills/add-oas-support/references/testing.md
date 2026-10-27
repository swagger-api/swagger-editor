# Testing Spec Support

SwaggerEditor relies on Playwright end-to-end tests; Vitest unit tests are few
(`src/plugins/editor-monaco/components/ValidationPane/ValidationPane.test.jsx`,
`src/plugins/editor-content-type/{actions,selectors}.test.js`). New Playwright tests are
TypeScript (`*.spec.ts`); Vitest tests in `src` stay JavaScript for now (`FOLLOW-UPS.md` 1.11).

## Playwright

Specs live in `test/playwright/e2e/`, helpers in `test/playwright/helpers/` (import from
`'../helpers'`). `playwright.config.ts` starts the dev server itself (`npm run pw:dev:server` on
port 3000, reused locally when already running).

Setup used by every preview spec (copy from `plugin.editor-preview-swagger-ui.spec.ts`):

```typescript
test.beforeEach(async ({ page }) => {
  await visitBlankPage(page);
  await prepareAsyncAPI(page);
  await prepareOasGenerator(page); // stubs the generator server lists
  await waitForSplashScreen(page);
});
```

| Helper | Use |
|--------|-----|
| `clickNestedMenuItem(page, 'File', 'Load Example', '<label>')` | load a fixture through the menu |
| `waitForContentPropagation(page)` | wait after setting content (detection, preview, validation are async) |
| `typeInEditor`, `getAllEditorText`, `selectAllEditorText`, `pasteToEditor` | edit content directly |
| `prepareOpenAPI30x`, `prepareOpenAPI20` | route stubs for import-URL tests |

### What to Cover for a New OpenAPI Version

Add tests next to the parent version's tests; don't create a new spec file for one version.

| Spec file | Test | Copy from |
|-----------|------|-----------|
| `plugin.editor-preview-swagger-ui.spec.ts` | `should display OpenAPI X.Y.Z`: title and `.version-stamp > .version` contains `OAS X.Y` | `should display OpenAPI 3.1.0` |
| `plugin.top-bar.spec.ts` | `should load OpenAPI X.Y Petstore example as YAML` (the "Load Example" describe) | the 3.1 / JSON Schema 2020-12 load tests |
| `plugin.top-bar.spec.ts` | generator menus shown or hidden for the version, matching the tracking doc's decision | the existing generator tests |
| `plugin.validation-pane.spec.ts` | an invalid new-version field produces a marker | existing validation tests |

Also rename `describe` titles that enumerate versions (`'Editor Preview Pane: OpenAPI 2.0,
3.0.x, 3.1.x'`) when you add a version to them.

Regression: keep (or add) a test that the parent version still renders as the parent
(`OAS X.Y-1` stamp). Detection branches added in the wrong place show up there first.

Run targeted, then all:

```bash
npx playwright test test/playwright/e2e/plugin.editor-preview-swagger-ui.spec.ts test/playwright/e2e/plugin.top-bar.spec.ts
npm run pw:test
```

## Vitest

`npm run test:run`. jsdom, globals enabled, setup in `test/setupTests.js`. Selector functions
are plain functions over Immutable state, so a selector test needs no system:

```javascript
import { Map } from 'immutable';

import { selectIsContentTypeOpenAPI32x } from './selectors.js';

test('detects OpenAPI 3.2 content type', () => {
  const state = Map({ contentType: 'application/vnd.oai.openapi+yaml;version=3.2.0' });
  expect(selectIsContentTypeOpenAPI32x(state)).toBe(true);
});
```

Add one when selector logic is more than a copy of the parent's (new content-type shapes,
JSON Schema dialect selectors). Detection cases go in `editor-content-type/actions.test.js`,
which runs the real `detectContentType` thunk against a minimal system.
