# Standalone JSON Schema: Design and Delivery

Source: Confluence, SHUB space, "Standalone JSON Schema" (page 4687691955, version 7,
2025-04-17). This file summarises it for the editor work and records what has changed since.
State-dependent statements carry a date; `spec-status.mjs --json-schema <dialect>` is the
current truth.

## What the Doc Asks For

- **Scope:** parse (ApiDOM), display (Swagger UI) and edit (SwaggerEditor@5) JSON Schema that
  isn't embedded in another spec. JSON Schema **2020-12 first**; other dialects later.
- **Version recognition:** initially the root schema **must** contain `$schema`; inferring the
  dialect from keywords is future work. Parser adapters rely on this.
- **ApiDOM** (est. 1.5-2 sprints): a standalone 2020-12 namespace extracted from OpenAPI 3.1 and
  re-integrated; JSON and YAML adapters; apidom-ls JSON Schema rules consolidated (their state
  was "not good"); apidom-reference strategies for resolution, dereferencing, reference
  validation and bundling.
- **Crossing dialect boundaries** is hard: `$schema` may appear in the document root and in the
  root of embedded schema resources, and must not appear in non-resource subschemas. The doc's
  two examples are in `dialects.md`.
- **Swagger UI** (est. 1 sprint): the modern renderer (2020-12) was designed for standalone use
  but lacks "arbitrary keyword" support; the legacy renderer (Draft 4/5) has unknown standalone
  ability. Proposal: legacy renderer for Draft 6, modern for Draft 7 and later.
- **SwaggerEditor@5** (est. 1 sprint): an `editor-preview-json-schema` plugin built on the
  modern renderer, the ApiDOM JSON Schema adapters integrated, semantic highlighting colours
  tuned, a Load Example item, the new ApiDOM version integrated. The display mechanism is the
  editor's "Using preview plugins in SwaggerUI" architecture (README), i.e. the plugin must also
  work inside a plain Swagger UI through the `swagger-ui-adapter` BaseLayout wrap.

**Scope decisions since the doc (2026-10-23):** Swagger UI renders standalone JSON Schema
natively, so the editor routes JSON Schema content to its existing Swagger UI preview instead of
building `editor-preview-json-schema` (`preview-routing.md`). References that cross dialects are
out of scope.

## Delivery Plans

| Plan | Order | Estimate | Editor result |
|------|-------|----------|---------------|
| 1, complete | ApiDOM, then Swagger UI, then SwaggerEditor | 3.5-4 sprints | preview, apidom-ls validation, completion, hover, semantic highlighting, reference validation |
| 2, MVP | Swagger UI and SwaggerEditor, ApiDOM later | 2 sprints | preview, basic highlighting, ajv validation as Monaco markers; no completion or hover |

This skill implements the SwaggerEditor part of **plan 1** and takes its ApiDOM part as done:
namespaces, JSON and YAML parser adapters, apidom-ls rules (validation, completion, hover,
semantic tokens) and apidom-reference strategies. Use the latest ApiDOM release; don't pin a
version from this file and don't re-verify ApiDOM's JSON Schema support. Plan 2's editor-side
substitutes (ajv validation, a Monarch grammar) are not part of this skill.

## PR Mapping (this skill)

| PR | Content |
|----|---------|
| 1 | ApiDOM bump and JSON Schema adapter dependencies, detection, selectors, file name, fixture, menu |
| 2 | routing to the Swagger UI preview (`EditorPreviewWrapper`, `detectContentTypeSuccess` wrap-action), swagger-ui-react bump, docs |
| 3 | language features check (apidom-ls markers, completion, hover), theme tokens, Download Resolved JSON/YAML |
| later | more dialects: adapters, detection, routing once Swagger UI renders them |

## State of SwaggerEditor and Swagger UI

Facts below were checked on 2026-10-23 against the then-installed packages. They describe
behaviour that changes slowly, but re-check any you rely on (`spec-status.mjs`, the bundle grep
in `keyword-map-template.md`).

Swagger UI (from the Swagger UI skills' research):

- `JSONSchema202012` and `withJSONSchema202012SystemContext` (apis preset) and the legacy
  renderer's `ModelWrapper`/`Model` (`JSONSchema5` plugin, base preset) are available through
  `getComponent` in the editor's Swagger UI system.
- Unknown keywords go to an "extension keywords" catch-all that is hidden unless
  `showExtensions` is on; "arbitrary keyword support" therefore means per-keyword rendering.
- Standalone gaps: `$ref` shown as a string (no resolution), plain-text descriptions, Draft 4-7
  array-form `items` probably mishandled, Draft 7 / 2019-09 keywords (`definitions`,
  `dependencies`, `additionalItems`, `$recursiveRef`) fall into the extension catch-all.
- The legacy renderer is coupled to OpenAPI selectors (`specSelectors.findDefinition`, `isOAS3`
  for `allOf`/`anyOf`/`oneOf`/`not`, `specPath`), so the Draft 6 proposal is an open decision.
- `oas31/after-load.js` replaces `fn.jsonSchema202012.isExpandable` and `getProperties` globally.
  Native rendering must work with that override in place (the editor always loads the OpenAPI
  plugins); that is Swagger UI's work, and the editor's Playwright tests catch a regression.
- Native standalone rendering is planned in swagger-ui's `/add-json-schema-support` (added by
  swagger-api/swagger-ui#11106) as one `json-schema-document` plugin for every dialect
  (registration key `JSONSchemaDocument`); the editor's upstream gate waits for the release that
  first renders the dialect.

SwaggerEditor (`main`):

- Done: 2020-12 detection (`application/schema+json|yaml;version=https://json-schema.org/draft/2020-12/schema`),
  `selectIsContentTypeJSONSchema` / `selectIsContentTypeJSONSchema202012`, fixture
  `selectJSONSchema202012YAML`, Load Example item "JSON Schema 2020-12" and its Playwright load
  test.
- Missing: the JSON Schema adapter dependencies, routing to the Swagger UI preview, docs, theme
  tokens, Download Resolved for JSON Schema, a JSON Schema file name for `Save as`. Today a 2020-12 document gets
  `EditorPreviewFallback` ("Unable to render editor content"): the Swagger UI preview and its
  `updateSpec` run for OpenAPI content only.
- The JSON detection regex matches `"$schema"` anywhere in the document, not only at the root
  (so do the ApiDOM adapters' `detectionRegExp`; the root check is the editor's job).

## Open Decisions (record each answer in the tracking doc)

1. Draft 6 renderer: legacy (doc) or modern (closer to Draft 7) - Swagger UI's call; the editor
   follows.
2. `$ref` display in the preview: Swagger UI's call (its `$ref` resolution decision); the editor
   follows.
3. Download Resolved JSON/YAML for JSON Schema: answered (2026-10-23): the same as for OpenAPI.
   The existing menu items dereference through the ApiDOM worker's `doDeref` (apidom-ls `doDeref`,
   apidom-reference `dereferenceApiDOM`); PR 3 adds the dialect to their conditions. No
   bundle-based download: the editor calls apidom-reference's `bundle()` for no spec.
4. Colours for the JSON Schema semantic token types in both Monaco themes.

Embedded `$schema` of another dialect is out of scope with references that cross dialects.
