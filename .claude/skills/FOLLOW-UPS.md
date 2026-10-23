# Follow-ups from Creating the Spec Support Skills (2026-10-23)

Found while writing and testing the skills. None were fixed in that session. Each item says how
to re-check it. Status legend: ⏳ open, ✅ done (add commit/PR reference).

## 1. Probable Bugs and Gaps on `main`

### 1.1 ⏳ JSON documents with a nested `$schema` are detected as JSON Schema 2020-12

- **Where:** `src/plugins/editor-content-type/actions.js`, the 2020-12 JSON branch: the regex
  matches `"$schema": "https://json-schema.org/draft/2020-12/schema"` anywhere in the document.
  The YAML branch only matches column 0 (root keys).
- **Effect:** `{"type": "object", "properties": {"a": {"$schema": "https://json-schema.org/draft/2020-12/schema"}}}`
  gets `application/schema+json;version=...` instead of `application/json`. The design doc
  requires the **root** `$schema`.
- **Check:** `node .claude/skills/add-oas-support/scripts/check-detection.mjs` (sample "JSON with
  nested $schema only" is `MISMATCH`).
- **Fix:** after the regex match, parse the JSON (it is parsed anyway by `isValidJSONObject`) and
  compare the root `$schema`. Belongs in PR 1 of `/add-json-schema-support`.
- **Commit:** `fix(editor-content-type): detect JSON Schema by root $schema only`

### 1.2 ⏳ No Playwright test mentions OpenAPI 3.2

- **Check:** `spec-status.mjs --oas 3.2` (`MISSING tests`).
- **Fix:** add "should display OpenAPI 3.2.0" to `plugin.editor-preview-swagger-ui.spec.ts` and
  "should load OpenAPI 3.2 Petstore example" to `plugin.top-bar.spec.ts`
  (`add-oas-support/references/testing.md`).
- **Commit:** `test: cover OpenAPI 3.2 example and preview`

### 1.3 ⏳ Generator menus ignore OpenAPI 3.2, without a recorded decision

- **Where:** `top-bar/components/GenerateServerMenu/OpenAPI3GenerateServerMenu.jsx`,
  `OpenAPI3GenerateClientMenu.jsx`, `top-bar/extensions/editor-content-type/wrap-actions.js`
  check only `selectIsContentTypeOpenAPI30x`/`31x`.
- **Check:** `spec-status.mjs --oas 3.2` (`DECIDE consumers`).
- **Fix:** ask whether `generator3.swagger.io` generates from 3.2 documents; widen the checks or
  add a code comment with the reason. Add a Playwright test either way.

### 1.4 ⏳ `Save as` file name for AsyncAPI 3 and JSON Schema is `definition`

- **Where:** `selectInferFileNameFromContent` in `editor-content-type/selectors.js` knows
  OpenAPI 2.0-3.2 and AsyncAPI 2 only.
- **Fix:** add `asyncapi3` and a JSON Schema name (e.g. `schema`); unit test the selector.

### 1.5 ⏳ Small OAS 3.2 leftovers

- `loadOpenAP32PetstoreFixture` (missing "I") in `LoadExampleNestedMenuHandler.jsx` and
  `LoadExampleNestedMenu.jsx`.
- `link:apidom` lists `@swagger-api/apidom-ns-openapi-3-2` twice.
- `editor-preview-swagger-ui/.../EditorPreviewWrapper.jsx` PropTypes declare
  `selectIsContentTypeOpenAPI31x`/`32x`, which the component doesn't call.
- **Commit:** `refactor: tidy OpenAPI 3.2 wiring leftovers`

### 1.6 ⏳ AsyncAPI 3 detection uses hand-written regexes

- **Where:** `editor-content-type/actions.js`, the two `asyncApi3*Match` branches. The AsyncAPI 3
  adapters exist (apidom-ls depends on them) and export `detectionRegExp`.
- **Fix:** add `@swagger-api/apidom-parser-adapter-asyncapi-{json,yaml}-3` as dependencies (with
  overrides) and use their regexes; `check-detection.mjs` must stay green. Out of these skills'
  scope (AsyncAPI); listed because the skills tell agents not to copy this pattern.

### 1.7 ⏳ Monaco themes have no entry for 8 apidom-ls OpenAPI token types

`parametersDefinitions`, `responsesDefinitions`, `httpMethod`, `items`, `headers`, `tag`, `xml`,
`scopes` (both themes). Possibly intentional (default colour, or `httpMethod` handled through
modifiers). Check with `spec-status.mjs --oas 3.2` (`NOTE theme`); decide and either map them or
document the default.

### 1.8 ✅ Remaining CLAUDE.md inaccuracies (2026-10-23)

The content-type, styles-path and debugging sections were corrected with the skills. Fixed
afterwards: the "State Access in Components" snippet used `useSystem()`, which doesn't exist in
`src`; it now shows the real pattern (system injected as props into containers resolved with
`getComponent(name, true)`, from `ThemeSelectionIcon.jsx`). Header and footer say version 5.10.0;
the overview lists AsyncAPI 3.1.

The Actions, Reducers, Selectors, System Access, Creating a New Plugin, Component Wrapping and
gotchas 4/9 snippets used names that don't exist in `src` (`loadDefinition`,
`SET_EDITOR_CONTENT`, `selectEditorContent`, `setEditorContent`, `selectValidationErrors`, a
per-plugin `initialState: Map(...)`, `action.payload.requestId`). They are now condensed from
`editor-preview-asyncapi` (actions, reducers, selectors) and `editor-preview-swagger-ui` (wrapper),
and say that reducers and selectors receive the plugin's own state slice and that request IDs
travel in `meta`.

## 2. Cross-Repository Work Found

- **ApiDOM:** the skills take ApiDOM's standalone JSON Schema support (adapters, apidom-ls) as
  given and don't check it. In a quick test on 2026-10-23, the apidom-ls then installed in
  swagger-editor returned no diagnostics, hover or completion for a standalone 2020-12 schema
  (its `parser-factory` had no JSON Schema adapters). If the editor shows no language features
  for JSON Schema after the ApiDOM bump, look there first.

## 3. ⏳ Eval Run

The eval cases under each skill's `evals/` have not been run yet. Each case's `fixture.md`
says how to recreate its worktree.
