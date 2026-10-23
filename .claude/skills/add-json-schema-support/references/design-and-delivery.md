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

## Delivery Plans

| Plan | Order | Estimate | Editor result |
|------|-------|----------|---------------|
| 1, complete | ApiDOM, then Swagger UI, then SwaggerEditor | 3.5-4 sprints | preview, apidom-ls validation, completion, hover, semantic highlighting, reference validation |
| 2, MVP | Swagger UI and SwaggerEditor, ApiDOM later | 2 sprints | preview, basic highlighting, ajv validation as Monaco markers; no completion or hover |

The MVP is explicitly a stepping stone: "We can then return to ApiDOM, to provide true language
server capabilities." Build the MVP so the full plan replaces pieces (validation provider,
highlighting) without restructuring the plugin.

## Plan to PR Mapping (this skill)

| PR | Content | MVP | Full |
|----|---------|-----|------|
| 1 | detection, selectors, file name, fixture, menu | yes | yes |
| 2 | `editor-preview-json-schema`, BaseLayout bypass, exports, docs | yes | yes |
| 3 | validation and highlighting | ajv markers, Monarch or generic tokens | apidom-ls (after ApiDOM work), theme tokens |
| later | more dialects | detection + renderer routing per dialect | plus ApiDOM namespaces/adapters/rules |

## State Since the Doc (verified 2026-10-23)

ApiDOM:

- Done: `apidom-ns-json-schema-2020-12` (#4670) and OpenAPI 3.1 using it (#4691, #4716);
  `apidom-parser-adapter-json-schema-json-2020-12` / `-yaml-2020-12` (#4677, #4676); apidom-ls
  config for standalone 2020-12 (#4838).
- Not done: apidom-ls `parser-factory` doesn't import the JSON Schema adapters, so the language
  service doesn't parse a standalone schema as JSON Schema; its 2020-12 config covers 4 keywords
  (`$comment`, `$id`, `$ref`, `$schema`). The editor doesn't depend on the JSON Schema adapters.
  Result: the full plan's validation, completion and hover still need ApiDOM work.

Swagger UI (`swagger-ui-react` 5.34.0, from the Swagger UI skills' research):

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
- `oas31/after-load.js` replaces `fn.jsonSchema202012.isExpandable` and `getProperties` globally;
  a standalone preview must render correctly with that override in place (the editor always
  loads the OpenAPI plugins).

SwaggerEditor (`main`):

- Done: 2020-12 detection (`application/schema+json|yaml;version=https://json-schema.org/draft/2020-12/schema`),
  `selectIsContentTypeJSONSchema` / `selectIsContentTypeJSONSchema202012`, fixture
  `selectJSONSchema202012YAML`, Load Example item "JSON Schema 2020-12" and its Playwright load
  test.
- Missing: the preview plugin, BaseLayout bypass, exports, docs, validation, a JSON Schema file
  name for `Save as`. Today a 2020-12 document falls through to the Swagger UI preview.
- The JSON detection regex matches `"$schema"` anywhere in the document, not only at the root.

## Open Decisions (record each answer in the tracking doc)

1. MVP or full plan (Step 0).
2. Draft 6 renderer: legacy (doc) or modern (closer to Draft 7) - Swagger UI's call; the editor
   follows.
3. Highlighting for the MVP: generic ApiDOM tokens, or a dialect Monarch definition that the
   full plan later deletes.
4. Embedded `$schema` of another dialect: render with the root dialect's renderer (MVP) or
   switch renderer per embedded resource (needs Swagger UI support).
5. `$ref` display in the preview: as text (today) or resolved (needs apidom-reference
   strategies, full plan).
