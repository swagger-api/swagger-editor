---
name: add-json-schema-support
description: Delivers standalone JSON Schema (a document that is only a schema, identified by its root `$schema`, starting with 2020-12) in SwaggerEditor, following the SwaggerHub "Standalone JSON Schema" design (Confluence SHUB 4687691955) - detection, an `editor-preview-json-schema` plugin rendering through Swagger UI's JSONSchema202012 renderer, the swagger-ui-adapter BaseLayout bypass, validation markers (ajv for the MVP plan, apidom-ls for the full plan), syntax highlighting, Load Example, exports, docs and Playwright tests, gated by `spec-status.mjs --json-schema`. Also covers adding further dialects (2019-09, Draft 7/6/4). Use whenever someone wants SwaggerEditor to edit, preview, validate or highlight a plain JSON Schema file, asks why a `$schema` document shows "Unable to render this definition" or the Swagger UI preview, or plans the editor part of standalone JSON Schema, even if they don't name this skill.
---

# Add Standalone JSON Schema Support to SwaggerEditor

"Standalone" means a document that is a JSON Schema, not one embedded in OpenAPI or AsyncAPI.
The design doc splits the work across three repositories:

| Layer | Repository | Provides |
|-------|------------|----------|
| Parse, refract, language service | ApiDOM | `apidom-ns-json-schema-*`, `apidom-parser-adapter-json-schema-{json,yaml}-2020-12`, apidom-ls rules |
| Render | Swagger UI | `JSONSchema202012` renderer and `withJSONSchema202012SystemContext` (2020-12, also for 2019-09/Draft 7); legacy `JSONSchema5` plugin's `ModelWrapper`/`Model` (Draft 4/5, Draft 6 undecided) |
| Edit and display | SwaggerEditor (this skill) | detection, `editor-preview-json-schema`, validation markers, highlighting, examples |

and offers two delivery plans: **full** (ApiDOM first, then Swagger UI, then the editor, with
apidom-ls validation, completion and hover) and **MVP** (Swagger UI and the editor only; ajv
validation translated to Monaco markers, basic highlighting, no completion or hover). Read
`references/design-and-delivery.md` for the doc's content, the open decisions and how they map
to the PRs below.

## Bundled Tools

| Tool | Use |
|------|-----|
| `node .claude/skills/add-oas-support/scripts/spec-status.mjs --json-schema <dialect>` | Upstream state (ApiDOM namespace and adapters, apidom-ls parsing and rule coverage, swagger-ui-react renderer and HOC, ajv) and every editor integration point. `UPSTREAM` blocks; `NOTE` lines tell which plan an absence blocks. |
| `node .claude/skills/add-oas-support/scripts/check-detection.mjs --json-schema <$schema URI>` | Runs the editor's real detection over samples, including documents whose only `$schema` is nested (must stay plain JSON/YAML) and OpenAPI documents with nested `$schema`. |
| `node .claude/skills/add-oas-support/scripts/verify-urls.mjs <paths>` / `--diff main` | URL and anchor check (meta-schema URIs, docs links). |
| `references/design-and-delivery.md` | Design doc digest, open decisions, plan-to-PR mapping. Read at Step 0. |
| `references/preview-plugin.md` | Plugin anatomy with the real files to copy, rendering, parsing, validation, highlighting. Read at Step 3. |
| `references/dialects.md` | `$schema` URIs, ApiDOM packages, renderer and ajv class per dialect; cross-dialect references. Read at Step 1. |
| `references/keyword-map-template.md` | Per-keyword coverage table for the tracking doc. Read at Step 1. |
| `../add-oas-support/references/testing.md` | Playwright and Vitest patterns. Read at Step 5. |
| `../add-oas-support/references/review-lessons.md` | General wiring lessons (registration, cross-plugin imports, dependencies). Read before Step 2. |

## Step 0: Plan, Dialect and Status (every invocation)

1. **Dialect.** The doc starts with 2020-12 only; other dialects are later increments. Use the
   one the user names, else 2020-12.
2. Run `spec-status.mjs --json-schema <dialect>` and read `references/design-and-delivery.md`.
3. **Plan.** Ask the user: MVP or full. Present the facts from the status output that decide it:
   whether apidom-ls parses standalone JSON Schema (parser-factory line), how many keywords its
   rules cover, whether the JSON Schema parser adapters are installed. Fallback when you can't
   ask (subagent): MVP when apidom-ls doesn't parse standalone JSON Schema, otherwise full;
   record the choice in the tracking doc.
4. **Stop on `UPSTREAM`.** A missing renderer or HOC in swagger-ui-react blocks the preview;
   report it as Swagger UI work (`swagger-api/swagger-ui`; its `/add-json-schema-support` skill is
   in progress on branch `docs/claude-skills-oas-json-schema`), and
   the full plan's ApiDOM gaps as ApiDOM work (`/add-spec-version` or `/update-ls-config` in
   `swagger-api/apidom`). Pieces that don't depend on the missing package (detection, fixture)
   may proceed only if the user agrees.

## Step 1: Tracking Doc and Keyword Map

1. Create `ADD-JSON-SCHEMA-{DIALECT}.md` at the repo root (uncommitted): plan, dialect, status
   output, decisions, and the keyword map from `references/keyword-map-template.md`.
2. Build the keyword map from the dialect's meta-schema vocabularies
   (`references/dialects.md` gives the URIs; fetch them, don't list keywords from memory). For
   each keyword: rendered by the Swagger UI renderer (component name, or "extension keywords"
   catch-all), validated (ajv / apidom-ls), completion and hover (apidom-ls config directory),
   in the example fixture. Mark each row MVP / full / out.
3. **Checkpoint:** show the plan, the PR split below and the keyword rows that are out of scope;
   confirm before code. As a subagent, record assumptions and continue.

## Step 2: PR 1, Detection and Routing Foundations

Only what's missing per `spec-status.mjs` (2020-12 detection, selectors, fixture and menu item
already exist on `main`):

1. Detection branch(es) in `editor-content-type/actions.js` for the dialect's `$schema` URI(s):
   JSON then YAML, content type `application/schema+json;version=<uri>` / `+yaml`, after the
   OpenAPI/AsyncAPI/ADS branches so a spec document with a nested `$schema` is never taken for a
   schema. Detection should key on the **root** `$schema` (design doc: "the root schema always
   contains `$schema`"); check it with `check-detection.mjs --json-schema <URI>` and test it with
   the doc's nested-`$schema` examples (`references/dialects.md`).
2. Selector `selectIsContentTypeJSONSchema<Suffix>` (registered), and
   `selectInferFileNameFromContent` naming schema files (e.g. `schema.json`/`.yaml`).
3. Fixture and Load Example item if missing; the fixture shows the dialect's keywords that the
   renderer displays.

May merge with PR 2 when small.

## Step 3: PR 2, `editor-preview-json-schema`

Follow `references/preview-plugin.md`:

1. Plugin with its own state (`editorPreviewJSONSchema`: parse status, parse result, errors),
   parsing the content with the generic ApiDOM JSON/YAML adapters and refracting it with the
   dialect's namespace element, on a `detectContentTypeSuccess` wrap-action.
2. `EditorPreview` wrap that renders the preview for `selectIsContentTypeJSONSchema()` and the
   dialect's renderer through `getComponent` (`JSONSchema202012` inside
   `withJSONSchema202012SystemContext`), plus parse-error and unknown-dialect states.
3. `swagger-ui-adapter` `BaseLayout` wrap: return the JSON Schema preview for JSON Schema
   content, like AsyncAPI and ADS, so SwaggerUI-hosted previews (README "Using preview plugins
   in SwaggerUI") work.
4. Register in `src/presets/monaco/index.js`, export in `SwaggerEditor.plugins` (`src/App.tsx`),
   list in README's plugin list and the "Using preview plugins in SwaggerUI" examples.

## Step 4: PR 3, Validation and Highlighting

- **MVP:** ajv (`references/dialects.md` for the class per dialect) validating the parsed
  schema against the dialect's meta-schema, errors mapped to Monaco markers with source
  positions through `fn.registerMarkerDataProvider` (pattern:
  `editor-preview-asyncapi/monaco.contribution.js`). Add `ajv` as a direct dependency.
  Highlighting: decide between the generic ApiDOM tokens and a Monarch definition for the
  dialect's keywords; record it.
- **Full:** nothing to build here until apidom-ls parses the dialect; then bump apidom, check
  semantic tokens against both themes (`se-vs-light.js`, `se-vs-dark.js`), and remove any MVP
  ajv provider so diagnostics aren't reported twice.

## Step 5: Tests

`../add-oas-support/references/testing.md` plus a new
`test/playwright/e2e/plugin.editor-preview-json-schema.spec.ts`:

- Load Example renders the schema preview (title, a property, a constraint), not Swagger UI.
- An invalid keyword value produces a marker (MVP or full).
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

Report the plan, PRs, `spec-status.mjs` summary before/after, keyword rows out of scope, and the
upstream work left for ApiDOM or Swagger UI with the skill that does it there.
