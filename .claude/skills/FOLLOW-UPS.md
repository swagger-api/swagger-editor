# Follow-ups from Creating the Spec Support Skills (2026-10-23)

Found while writing and testing the skills. None were fixed in that session. Each item says how
to re-check it. Status legend: ⏳ open, ✅ done (add commit/PR reference).

## 1. Probable Bugs and Gaps on `main`

### 1.1 ✅ JSON documents with a nested `$schema` are detected as JSON Schema 2020-12

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
- **Done:** that commit on branch `feat/json-schema-2020-12` (PR 1 of `/add-json-schema-support`,
  2026-10-27). It also excludes roots with `openapi`, `swagger`, `asyncapi` or `arazzo`
  (decision of 2026-10-27); `check-detection.mjs` gained samples for both.

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
- **Partly done:** JSON Schema is named `schema` on branch `feat/json-schema-2020-12`
  (`feat(editor-content-type): save JSON Schema as schema.json/.yaml`, 2026-10-27, with
  `selectors.test.js`). AsyncAPI 3 is still `definition`: there is no
  `selectIsContentTypeAsyncAPI3` yet (`/add-spec-support`, with 1.6).

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
  overrides) and use their regexes; `check-detection.mjs` must stay green. In scope of
  `/add-spec-support`; `spec-status.mjs --spec asyncapi --version 3.1` reports it (`MISSING deps`
  and `detection`).

### 1.7 ⏳ Monaco themes have no entry for 8 apidom-ls OpenAPI token types

`parametersDefinitions`, `responsesDefinitions`, `httpMethod`, `items`, `headers`, `tag`, `xml`,
`scopes` (both themes). Possibly intentional (default colour, or `httpMethod` handled through
modifiers). Check with `spec-status.mjs --oas 3.2` (`NOTE theme`); decide and either map them or
document the default.

### 1.9 ⏳ No Playwright test loads an AsyncAPI 3.1 example

- **Check:** `spec-status.mjs --spec asyncapi --version 3.1` (`MISSING tests`; the same run
  also reports 1.4 and 1.6). `plugin.top-bar.spec.ts` loads only the AsyncAPI 2.6 examples.
- **Fix:** add "should load AsyncAPI 3.1 Petstore example as YAML" next to the 2.6 tests.
- **Commit:** `test: cover AsyncAPI 3.1 examples`

### 1.10 ⏳ A JSON Schema whose examples contain an `openapi`/`swagger`/`asyncapi` string is detected as that spec

Found by the `/review-spec-support` review of `feat/json-schema-2020-12` (2026-10-27); the same
on `main`.

- **Where:** `editor-content-type/actions.js`. The OpenAPI and AsyncAPI JSON branches run before
  the JSON Schema branches, and their adapters' `detectionRegExp` (and the JSON alternative of
  the YAML ones) match `"openapi": "<version>"` anywhere in the text; the only guard is
  `isValidJSONObject`/`isValidYAMLObject`.
- **Effect:** with `S` = `https://json-schema.org/draft/2020-12/schema`:

  | Document | Detected |
  |----------|----------|
  | `{"$schema": S, "type": "object", "examples": [{"openapi": "3.1.0"}]}` | `application/vnd.oai.openapi+json;version=3.1.0` |
  | `{"$schema": S, "properties": {"spec": {"type": "object", "default": {"swagger": "2.0"}}}}` | `application/vnd.oai.openapi+json;version=2.0` |
  | `{"$schema": S, "properties": {"doc": {"const": {"openapi": "3.0.4"}}}}` | `application/vnd.oai.openapi+json;version=3.0.4` |
  | `{"$schema": S, "examples": [{"asyncapi": "2.6.0"}]}` | `application/vnd.aai.asyncapi+json;version=2.6.0` |
  | YAML `$schema: S` with `examples:` / `- {"openapi": "3.1.0"}` (flow style) | `application/vnd.oai.openapi+yaml;version=3.1.0` |

  The same YAML in block style (`- openapi: 3.1.0`) is detected as JSON Schema: the YAML
  alternative of the regexes only matches root keys (column 0).
- **Check:** run `detectContentType` on the documents above (e.g. a `--sample` file for
  `check-detection.mjs` with the expected JSON Schema content type).
- **Fix:** confirm the version field is a root member, as the JSON Schema branches confirm the
  root `$schema` (`fn.isJSONSchemaDocumentJSON`); check whether ApiDOM's adapters and apidom-ls
  detect these documents the same way first, so the editor keeps agreeing with them.

### 1.11 ⏳ Vitest test files: TypeScript or JavaScript

- **Conflict:** `review-spec-support/references/review-checklist.md` section 9 says new test
  files are TypeScript; CLAUDE.md's file-naming table shows unit tests as `ComponentName.test.jsx`,
  and the existing ones are JavaScript.
- **Why `editor-content-type/{actions,selectors}.test.js` stayed JavaScript** (2026-10-27): as
  `.test.ts` (with `import { describe, expect, test, vi } from 'vitest'`) they pass
  `tsc -p tsconfig.json` and lint, but
  - under `typescript-strict-plugin`, which checks every file without `// @ts-strict-ignore`
    (CLAUDE.md: new files aim for strictness), importing the untyped plugin modules
    (`./actions.js`, `./fn.js`, `./selectors.js`) is TS7016, fixable only by that suppression
    or by declarations for the modules;
  - `tsconfig.json` includes `src/**/*.ts`, so `build:definitions` emits
    `dist/types/**/*.test.d.ts`, and `.npmignore` publishes `dist/`.
- **Fix:** exclude `src/**/*.{test,spec}.{ts,tsx}` from `tsconfig.json` and type-check tests
  with their own config (vitest types), then convert; or state in CLAUDE.md and the checklist
  that Vitest tests in `src` are JavaScript.

## 2. Cross-Repository Work Found

- **ApiDOM:** the skills take ApiDOM's standalone JSON Schema support as given for detection and
  routing. In a quick test on 2026-10-23, the apidom-ls then installed in swagger-editor returned
  no diagnostics, hover or completion for a standalone 2020-12 schema (its `parser-factory` had
  no JSON Schema adapters). `spec-status.mjs --json-schema` now checks that before the
  language-features PR (area `language`): it stays `MISSING` until an ApiDOM release wires the
  adapters into `parser-factory` (apidom's `/add-spec-version` phase 4).

## 3. ⏳ Eval Run

The eval cases under each skill's `evals/` have not been run yet. Each case's `fixture.md`
says how to recreate its worktree.
