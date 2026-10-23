---
name: add-json-schema-support
description: Delivers standalone JSON Schema (a document that is only a schema, identified by its root `$schema`, starting with 2020-12) in SwaggerEditor, following the SwaggerHub "Standalone JSON Schema" design (Confluence SHUB 4687691955), with the ApiDOM part taken as done - ApiDOM JSON Schema parser adapters for detection and parsing, apidom-ls for validation, completion, hover and semantic highlighting, an `editor-preview-json-schema` plugin rendering through Swagger UI's JSONSchema202012 renderer, the swagger-ui-adapter BaseLayout bypass, theme tokens, Load Example, exports, docs and Playwright tests, gated by `spec-status.mjs --json-schema`. Also covers adding further dialects (2019-09, Draft 7/6/4). Use whenever someone wants SwaggerEditor to edit, preview, validate or highlight a plain JSON Schema file, asks why a `$schema` document shows "Unable to render this definition" or the Swagger UI preview, or plans the editor part of standalone JSON Schema, even if they don't name this skill.
---

# Add Standalone JSON Schema Support to SwaggerEditor

"Standalone" means a document that is a JSON Schema, not one embedded in OpenAPI or AsyncAPI.
The design doc splits the work across three repositories:

| Layer | Repository | Provides |
|-------|------------|----------|
| Parse, refract, language service | ApiDOM | `apidom-ns-json-schema-*`, `apidom-parser-adapter-json-schema-{json,yaml}-<dialect>`, apidom-ls validation, completion, hover and semantic tokens |
| Render | Swagger UI | `JSONSchema202012` renderer and `withJSONSchema202012SystemContext` (2020-12, also for 2019-09/Draft 7); legacy `JSONSchema5` plugin's `ModelWrapper`/`Model` (Draft 4/5, Draft 6 undecided) |
| Edit and display | SwaggerEditor (this skill) | dependencies, detection, `editor-preview-json-schema`, theme tokens, examples |

**This skill takes the ApiDOM layer as done.** It implements the SwaggerEditor part of the
doc's complete delivery plan: the editor consumes ApiDOM's JSON Schema adapters and apidom-ls
the same way it consumes them for OpenAPI. Don't build a separate validator, Monarch grammar or
completion source in the editor, and don't re-verify ApiDOM's JSON Schema support; bump to the
latest ApiDOM release and use it. Read `references/design-and-delivery.md` for the doc's
content, the open decisions and how they map to the PRs below.

## Bundled Tools

| Tool | Use |
|------|-----|
| `node .claude/skills/add-oas-support/scripts/spec-status.mjs --json-schema <dialect>` | Swagger UI renderer and HOC in swagger-ui-react (`UPSTREAM` blocks), ApiDOM packages declared as dependencies, and every editor integration point. |
| `node .claude/skills/add-oas-support/scripts/check-detection.mjs --json-schema <$schema URI>` | Runs the editor's real detection over samples, including documents whose only `$schema` is nested (must stay plain JSON/YAML) and OpenAPI documents with nested `$schema`. |
| `node .claude/skills/add-oas-support/scripts/verify-urls.mjs <paths>` / `--diff main` | URL and anchor check (meta-schema URIs, docs links). |
| `references/design-and-delivery.md` | Design doc digest, open decisions, plan-to-PR mapping. Read at Step 0. |
| `references/preview-plugin.md` | Plugin anatomy with the real files to copy, parsing, rendering, language features. Read at Step 3. |
| `references/dialects.md` | `$schema` URIs, ApiDOM packages and renderer per dialect; cross-dialect references. Read at Step 1. |
| `references/keyword-map-template.md` | Per-keyword coverage table for the tracking doc. Read at Step 1. |
| `../add-oas-support/references/testing.md` | Playwright and Vitest patterns. Read at Step 5. |
| `../add-oas-support/references/review-lessons.md` | General wiring lessons (registration, cross-plugin imports, dependencies). Read before Step 2. |

## Step 0: Dialect and Status (every invocation)

1. **Dialect.** The doc starts with 2020-12 only; other dialects are later increments. Use the
   one the user names, else 2020-12.
2. Run `spec-status.mjs --json-schema <dialect>` and read `references/design-and-delivery.md`.
3. **Stop on `UPSTREAM`.** A missing renderer or HOC in swagger-ui-react blocks the preview;
   report it as Swagger UI work (`swagger-api/swagger-ui`; its `/add-json-schema-support` skill is
   in progress on branch `docs/claude-skills-oas-json-schema`). Pieces that don't depend on the
   renderer (dependencies, detection, fixture) may proceed only if the user agrees.

## Step 1: Tracking Doc and Keyword Map

1. Create `ADD-JSON-SCHEMA-{DIALECT}.md` at the repo root (uncommitted): dialect, ApiDOM and
   swagger-ui-react versions, status output, decisions, and the keyword map from
   `references/keyword-map-template.md`.
2. Build the keyword map from the dialect's meta-schema vocabularies
   (`references/dialects.md` gives the URIs; fetch them, don't list keywords from memory). For
   each keyword: rendered by the Swagger UI renderer (component name, or "extension keywords"
   catch-all), in the example fixture, and in scope or out. Validation, completion and hover
   come from apidom-ls and need no per-keyword editor work.
3. **Checkpoint:** show the PR split below and the keyword rows that are out of scope; confirm
   before code. As a subagent, record assumptions and continue.

## Step 2: PR 1, Dependencies and Detection

Only what's missing per `spec-status.mjs` (2020-12 detection, selectors, fixture and menu item
already exist on `main`):

1. **Dependencies.** Bump every `@swagger-api/apidom-*` package to the latest release (one
   version for all). Add `@swagger-api/apidom-parser-adapter-json-schema-json-<dialect>` and
   `-yaml-<dialect>` to `dependencies` (runtime imports: detection and the preview's parsing),
   `overrides` and `link:apidom`, like the OpenAPI adapters
   (`../add-oas-support/references/integration-points.md` section 1). apidom-ls stays in
   `devDependencies` (worker-only).
2. **Detection** in `editor-content-type/actions.js`: JSON then YAML branches using the
   adapters' `detectionRegExp` (its version group is the dialect id, e.g. `2020-12`; keep the
   editor's content-type format `application/schema+json;version=<$schema URI>` so the existing
   selectors keep working), after the OpenAPI/AsyncAPI/ADS branches. Detection keys on the
   **root** `$schema` (design doc: "the root schema always contains `$schema`"); the adapter
   regexes alone also match a nested `$schema`, so confirm the match is at the root. Check with
   `check-detection.mjs --json-schema <URI>` and test with the doc's nested-`$schema` examples
   (`references/dialects.md`).
3. Selector `selectIsContentTypeJSONSchema<Suffix>` (registered), and
   `selectInferFileNameFromContent` naming schema files (e.g. `schema.json`/`.yaml`).
4. Fixture and Load Example item if missing; the fixture shows the dialect's keywords that the
   renderer displays.

May merge with PR 2 when small.

## Step 3: PR 2, `editor-preview-json-schema`

Follow `references/preview-plugin.md`:

1. Plugin with its own state (`editorPreviewJSONSchema`: parse status, parse result, errors),
   parsing the content with the dialect's ApiDOM JSON Schema adapter (`parse` returns a parse
   result whose element is the dialect's JSON Schema element), on a `detectContentTypeSuccess`
   wrap-action.
2. `EditorPreview` wrap that renders the preview for `selectIsContentTypeJSONSchema()` and the
   dialect's renderer through `getComponent` (`JSONSchema202012` inside
   `withJSONSchema202012SystemContext`), plus parse-error and unknown-dialect states.
3. `swagger-ui-adapter` `BaseLayout` wrap: return the JSON Schema preview for JSON Schema
   content, like AsyncAPI and ADS, so SwaggerUI-hosted previews (README "Using preview plugins
   in SwaggerUI") work.
4. Register in `src/presets/monaco/index.js`, export in `SwaggerEditor.plugins` (`src/App.tsx`),
   list in README's plugin list and the "Using preview plugins in SwaggerUI" examples.

## Step 4: PR 3, Language Features and Highlighting

apidom-ls in the ApiDOM worker provides validation markers, completion, hover and semantic
tokens for the dialect once the dependencies are bumped; the editor's part is:

1. Load the example and an invalid schema in the running editor (`npm start`): markers in the
   Validation Pane, completion of keywords, hover documentation on a keyword. Record what you saw
   in the tracking doc.
2. Theme tokens: list the JSON Schema token types apidom-ls emits
   (`node_modules/@swagger-api/apidom-ls/src/config/` token lists, or `getSemanticTokensLegend()`
   in the worker) and give each an entry in both `se-vs-light.js` and `se-vs-dark.js` (the
   design doc: "coloring of semantic highlighting needs to be tinkered with").
3. Don't add an editor-side validator, completion provider or Monarch grammar for JSON Schema;
   gaps in what apidom-ls provides are ApiDOM issues.

## Step 5: Tests

`../add-oas-support/references/testing.md` plus a new
`test/playwright/e2e/plugin.editor-preview-json-schema.spec.ts`:

- Load Example renders the schema preview (title, a property, a constraint), not Swagger UI.
- An invalid keyword value produces a Validation Pane entry.
- Detection: OpenAPI 3.1/3.2 documents with nested schemas still render in Swagger UI; a
  document without root `$schema` is not routed to the schema preview.
- Switching content from JSON Schema to OpenAPI and back swaps the preview.

## Step 6: Gates (each PR)

- `npm run lint`, `npm run test:run`, `npm run build`, targeted then full `npm run pw:test`.
- `spec-status.mjs --json-schema <dialect>`: 0 `UPSTREAM`; `MISSING` only for items of later
  PRs (listed in the tracking doc).
- `check-detection.mjs --json-schema <URI>`: 0 `MISMATCH` (from PR 1 on).
- `verify-urls.mjs --diff main`: 0 `BROKEN`.
- `/review-spec-support` in a fresh subagent with "JSON Schema <dialect>" and the branch.

## Step 7: Pull Requests

Branch `feat/json-schema-<dialect>` (PR 2 and 3 stacked on PR 1 while it is open). Titles e.g.
`feat(editor-preview-json-schema): add JSON Schema 2020-12 preview`. Pushing and opening PRs
need the user's confirmation. Commit format: CLAUDE.md.

## Hand-off

Report the PRs, `spec-status.mjs` summary before/after, keyword rows out of scope, what the
language features showed in Step 4, and any Swagger UI work left with the skill that does it
there.
