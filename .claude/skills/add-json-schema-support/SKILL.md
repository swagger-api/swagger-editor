---
name: add-json-schema-support
description: Delivers standalone JSON Schema (a document that is only a schema, identified by its root `$schema`, starting with 2020-12) in SwaggerEditor, following the "Standalone JSON Schema" design doc, with the ApiDOM part taken as done and Swagger UI rendering the document natively - ApiDOM JSON Schema parser adapters for detection, apidom-ls for validation, completion, hover and semantic highlighting, routing JSON Schema content to the existing Swagger UI preview (no editor preview plugin), the swagger-ui-react upgrade, the highlighting check, Load Example, docs and Playwright tests, gated by `spec-status.mjs --json-schema`. Also covers adding further dialects (2019-09, Draft 7/6/4). Use whenever someone wants SwaggerEditor to edit, preview, validate or highlight a plain JSON Schema file, asks why a `$schema` document shows "Unable to render editor content" or "Unable to render this definition", or plans the editor part of standalone JSON Schema, even if they don't name this skill.
---

# Add Standalone JSON Schema Support to SwaggerEditor

"Standalone" means a document that is a JSON Schema, not one embedded in OpenAPI or AsyncAPI.
The work splits across four repositories (the design doc names three; `$ref` resolution moved to
swagger-client on 2026-10-25):

| Layer | Repository | Provides |
|-------|------------|----------|
| Parse, refract, language service | ApiDOM | `apidom-ns-json-schema-*`, `apidom-parser-adapter-json-schema-{json,yaml}-<dialect>`, apidom-ls validation, completion, hover and semantic tokens |
| Resolve `$ref` for the preview | swagger-client | the `json-schema-<dialect>-apidom` strategy (swagger-client's `/add-json-schema-support`), reaching the editor through swagger-ui-react |
| Render | Swagger UI | native standalone JSON Schema rendering: detection of the root `$schema`, a layout branch, the plugin in the `apis` preset (swagger-ui's `/add-json-schema-support`) |
| Edit and display | SwaggerEditor (this skill) | dependencies, detection, routing to the Swagger UI preview, highlighting check, examples |

**This skill takes the ApiDOM layer as done and Swagger UI's rendering as given.** It implements
the SwaggerEditor part of the doc's complete delivery plan: the editor consumes ApiDOM's JSON
Schema adapters and apidom-ls the same way it consumes them for OpenAPI, and shows the document in
the Swagger UI preview it already has. Don't build a preview plugin, a separate validator, a
Monarch grammar or a completion source in the editor, and don't re-verify ApiDOM's JSON Schema
support beyond `spec-status.mjs`'s `language` row before PR 3; bump to the latest ApiDOM release
and use it. Read `references/design-and-delivery.md`
for the doc's content, the open decisions and how they map to the PRs below.

## Bundled Tools

| Tool | Use |
|------|-----|
| `node .claude/skills/add-oas-support/scripts/spec-status.mjs --json-schema <dialect> [--swagger-ui-plugin <key> --swagger-ui-version <release>]` | Native rendering of the dialect in swagger-ui-react (`UPSTREAM` blocks), ApiDOM packages declared as dependencies, apidom-ls parsing the dialect (area `language`, blocks PR 3 only), every editor integration point, and dependencies from tarballs of an unreleased upstream PR (`UNRELEASED`). |
| `node .claude/skills/add-oas-support/scripts/check-detection.mjs --json-schema <$schema URI>` | Runs the editor's real detection over samples, including documents whose only `$schema` is nested and API descriptions (Arazzo, undetected OpenAPI/AsyncAPI versions) with a root `$schema` (both must stay plain JSON/YAML), and OpenAPI documents with nested `$schema`. |
| `node .claude/skills/add-oas-support/scripts/verify-urls.mjs <paths>` / `--diff main` | URL and anchor check (meta-schema URIs, docs links). |
| `references/design-and-delivery.md` | Design doc digest, open decisions, plan-to-PR mapping. Read at Step 0. |
| `references/preview-routing.md` | What the Swagger UI preview does with JSON Schema today, the two files to change, the upstream gate, the tests. Read at Step 3. |
| `references/dialects.md` | `$schema` URIs, ApiDOM packages and renderer per dialect; the design doc's cross-dialect examples (out of scope, kept as root-detection fixtures). Read at Step 1. |
| `references/keyword-map-template.md` | Per-keyword coverage table for the tracking doc. Read at Step 1. |
| `../add-oas-support/references/unreleased-upstream.md` | Starting a PR on a ready but unreleased Swagger UI or ApiDOM PR: pack its branch, wire the tarballs, replace them with the release before merging. Read at Step 0 when an upstream isn't released yet. |
| `../add-oas-support/references/testing.md` | Playwright and Vitest patterns. Read at Step 5. |
| `../add-oas-support/references/review-lessons.md` | General wiring lessons (registration, cross-plugin imports, dependencies). Read before Step 2. |

## Step 0: Dialect and Status (every invocation)

1. **Dialect.** The doc starts with 2020-12 only; other dialects are later increments. Use the
   one the user names, else 2020-12.
2. Run `spec-status.mjs --json-schema <dialect> --swagger-ui-plugin JSONSchemaDocument
   --swagger-ui-version <release>` and read `references/design-and-delivery.md`. Both values come
   from Swagger UI's skill: the registration key (decision 7) is the same for every dialect, and
   `<release>` is the first swagger-ui release that renders this dialect (its hand-off). Without
   both the gate reports `UPSTREAM`.
3. **`UPSTREAM`.** A swagger-ui-react release without native standalone JSON Schema rendering
   blocks PR 2. If the Swagger UI PR that adds it is ready (its exit gate passes, its review is
   clean), install a swagger-ui-react tarball of its branch
   (`../add-oas-support/references/unreleased-upstream.md`) and re-run with the tarball's version
   as `--swagger-ui-version`; PR 2 then merges only after the Swagger UI release. Otherwise stop
   and report it as Swagger UI work (`swagger-api/swagger-ui`, its `/add-json-schema-support`
   skill, on `main` since swagger-api/swagger-ui#11106). Pieces that don't depend on the
   rendering (dependencies, detection, fixture) may proceed only if the user agrees.

## Step 1: Tracking Doc and Keyword Map

1. Create `ADD-JSON-SCHEMA-{DIALECT}.md` at the repo root (uncommitted): dialect, ApiDOM and
   swagger-ui-react versions, the Swagger UI key and release, status output, decisions, and the
   keyword map from `references/keyword-map-template.md`.
2. Build the keyword map from the dialect's meta-schema vocabularies
   (`references/dialects.md` gives the URIs; fetch them, don't list keywords from memory). For
   each keyword: rendered by Swagger UI (component name, or "extension keywords" catch-all), in
   the example fixture, and in scope or out. Validation, completion and hover come from
   apidom-ls and need no per-keyword editor work; rendering gaps are Swagger UI work.
3. **Checkpoint:** show the PR split below and the keyword rows that are out of scope; confirm
   before code. As a subagent, record assumptions and continue.

## Step 2: PR 1, Dependencies and Detection

Only what's missing per `spec-status.mjs` (2020-12 detection, selectors, fixture and menu item
already exist on `main`):

1. **Dependencies.** Bump every `@swagger-api/apidom-*` package to the latest release (one
   version for all; before the ApiDOM release, tarballs of its ready PR,
   `../add-oas-support/references/unreleased-upstream.md`). Add
   `@swagger-api/apidom-parser-adapter-json-schema-json-<dialect>` and `-yaml-<dialect>` to
   `dependencies` (runtime imports for detection, like the OpenAPI adapters
   in `editor-content-type/actions.js`), `overrides` and `link:apidom`
   (`../add-oas-support/references/integration-points.md` section 1). apidom-ls stays in
   `devDependencies` (worker-only).
2. **Detection** in `editor-content-type/actions.js`: JSON then YAML branches using the
   adapters' `detectionRegExp` (its version group is the dialect id, e.g. `2020-12`; keep the
   editor's content-type format `application/schema+json;version=<$schema URI>` so the existing
   selectors keep working), after the OpenAPI/AsyncAPI/ADS branches. Detection keys on the
   **root** `$schema` (design doc: "the root schema always contains `$schema`"); the adapter
   regexes alone also match a nested `$schema`, so confirm the match is at the root. A root
   with any of `openapi`, `swagger`, `asyncapi`, `arazzo`, whatever its value, is an API
   description and never JSON Schema (decision of 2026-10-27, the rule swagger-client, Swagger
   UI and apidom-ls apply): an Arazzo document, or an OpenAPI/AsyncAPI version no branch
   detects, reaches the JSON Schema branches and must fall through to plain JSON/YAML. The
   editor's `fn.isJSONSchemaDocumentJSON`/`YAML` (`editor-content-type/fn.js`) do both checks;
   pass them the dialect's URI. Check with `check-detection.mjs --json-schema <URI>` and test
   with the doc's nested-`$schema` examples (`references/dialects.md`).
3. Selector `selectIsContentTypeJSONSchema<Suffix>` (registered), and
   `selectInferFileNameFromContent` naming schema files (e.g. `schema.json`/`.yaml`).
4. Fixture and Load Example item if missing; the fixture shows the dialect's keywords that
   Swagger UI displays.

May merge with PR 2 when small.

## Step 3: PR 2, Route to the Swagger UI Preview

Follow `references/preview-routing.md`. Today a JSON Schema document gets the editor's
`EditorPreviewFallback` ("Unable to render editor content"), because the Swagger UI preview
handles OpenAPI only.

1. `editor-preview-swagger-ui`'s `EditorPreviewWrapper.jsx` renders `EditorPreviewSwaggerUI`
   for the dialects Swagger UI renders natively (dialect selectors, not
   `selectIsContentTypeJSONSchema()`).
2. Its `detectContentTypeSuccess` wrap-action passes those dialects to Swagger UI
   (`specActions.updateSpec`) like OpenAPI content, using one shared condition.
3. Bump `swagger-ui-react` to the release that passed the upstream gate (before the Swagger UI
   release, the tarball that passed it; the release replaces it before merging).
4. No new plugin, no `swagger-ui-adapter` `BaseLayout` change, no new exports: Swagger UI's own
   `BaseLayout` renders the document, in the editor and in SwaggerUI-hosted previews. Download
   Resolved comes in PR 3, because it needs the ApiDOM release; the online validator badge stays
   OpenAPI-only.

## Step 4: PR 3, Language Features and Highlighting

apidom-ls in the ApiDOM worker provides validation markers, completion, hover and semantic
tokens for the dialect once the dependencies are bumped; the editor's part is:

0. **Start only when `spec-status.mjs` reports both `language` rows `OK`** (the installed
   apidom-ls `parser-factory` imports the dialect's adapters, and the installed apidom-reference
   has the dialect's dereference strategy). While one is `MISSING`, the ApiDOM
   release isn't there yet: if apidom's phase 4 PR is ready, install tarballs of its branch
   (`../add-oas-support/references/unreleased-upstream.md`); otherwise stop and report it as
   ApiDOM work (apidom's `/add-spec-version`, phase 4) instead of debugging the editor.
1. Load the example and an invalid schema in the running editor (`npm start`): markers in the
   Validation Pane, completion of keywords, hover documentation on a keyword. Record what you saw
   in the tracking doc.
2. Highlighting follows the OpenAPI pattern (decision 4 in `references/design-and-delivery.md`):
   all keys share one colour and all values another. apidom-ls emits `key` and `value` tokens
   for JSON Schema and no JSON Schema token types; both themes already colour `key.string`,
   `key.number`, `value`, `value.string` and `value.number`, and `$ref` gets
   `reference-element`/`reference-value` as in OpenAPI 3.1. So change neither `se-vs-light.js`
   nor `se-vs-dark.js`: check in both themes that keywords, nested schema keys and values get
   those colours. A JSON Schema token type in the worker's `getSemanticTokensLegend()` is an
   apidom-ls deviation to report, not a theme entry to add.
3. **Download Resolved JSON/YAML**, the same way as for OpenAPI: add the dialect selector
   (`selectIsContentTypeJSONSchema<Suffix>()`) to the conditions of
   `top-bar/components/FileMenu/items/DownloadResolvedJSONMenuItem.jsx` and
   `DownloadResolvedYAMLMenuItem.jsx`, which offer the items for OpenAPI and AsyncAPI only.
   Nothing else changes: the handlers call `editorActions.dereferenceContent`, which calls the
   ApiDOM worker's `doDeref`, and apidom-ls's `doDeref` parses with its `parser-factory` and
   dereferences with apidom-reference's `dereferenceApiDOM`. It works once both `language` rows
   of `spec-status.mjs` are `OK` (apidom-ls parses the dialect, apidom-reference has its
   dereference strategy). The editor calls apidom-reference's `bundle()` for no spec, so bundling
   isn't on this path.
4. Don't add an editor-side validator, completion provider or Monarch grammar for JSON Schema;
   gaps in what apidom-ls provides are ApiDOM issues.

## Step 5: Tests

`../add-oas-support/references/testing.md`, with the preview cases in
`test/playwright/e2e/plugin.editor-preview-swagger-ui.spec.ts` (`references/preview-routing.md`,
"Tests"):

- Load Example renders the schema in the Swagger UI preview (its title or a property), and the
  editor's fallback text is absent.
- An invalid keyword value produces a Validation Pane entry.
- Detection: OpenAPI 3.1/3.2 documents with nested schemas still render as OpenAPI; a document
  without a root `$schema` is not routed.
- Switching content from JSON Schema to OpenAPI and back swaps the rendered document.
- Download Resolved JSON and YAML are offered for the dialect, and the downloaded file
  (Playwright's `download` event) has its external `$ref`s resolved. No Playwright spec covers
  Download Resolved yet, for OpenAPI either; this is the first.

## Step 6: Gates (each PR)

- `npm run lint`, `npm run test:run`, `npm run build`, targeted then full `npm run pw:test`.
- `spec-status.mjs --json-schema <dialect> --swagger-ui-plugin JSONSchemaDocument
  --swagger-ui-version <release>`: 0 `UPSTREAM` (PR 1 may run before it with the user's
  agreement); `MISSING` only for items of later PRs (listed in the tracking doc). Before merging:
  0 `UNRELEASED`, with the real Swagger UI release as `--swagger-ui-version`
  (`../add-oas-support/references/unreleased-upstream.md` section 4).
- `check-detection.mjs --json-schema <URI>`: 0 `MISMATCH` (from PR 1 on).
- `verify-urls.mjs --diff main`: 0 `BROKEN`.
- `/review-spec-support` in a fresh subagent with "JSON Schema <dialect>" and the branch.

## Step 7: Pull Requests

Branch `feat/json-schema-<dialect>` (PR 2 and 3 stacked on PR 1 while it is open). Titles e.g.
`feat(editor-preview-swagger-ui): render JSON Schema 2020-12 documents`. Pushing and opening PRs
need the user's confirmation. Commit format: CLAUDE.md.

## Hand-off

Report the PRs, `spec-status.mjs` summary before/after, keyword rows out of scope, what the
language features showed in Step 4, and any Swagger UI work left with the skill that does it
there.
