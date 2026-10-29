# Routing JSON Schema to the Swagger UI Preview

Swagger UI renders standalone JSON Schema documents natively (detection of the root `$schema`, a
layout branch, registration in the `apis` preset; swagger-ui's `/add-json-schema-support`). The
editor therefore adds no preview plugin: it sends JSON Schema content to the Swagger UI preview it
already has, and Swagger UI decides how to render it.

## What Happens Today

Read these files before changing them; line-level details drift.

| File | Behaviour |
|------|-----------|
| `src/plugins/editor-preview-swagger-ui/extensions/editor-preview/wrap-components/EditorPreviewWrapper.jsx` | Renders `EditorPreviewSwaggerUI` only when `editorSelectors.selectIsContentTypeOpenAPI()`; any other content falls through the AsyncAPI and API Design Systems wrappers to `EditorPreviewFallback` ("Unable to render editor content"). A JSON Schema document gets that fallback. |
| `src/plugins/editor-preview-swagger-ui/extensions/editor-content-type/wrap-actions.js` | `detectContentTypeSuccess` passes the content to Swagger UI (`specActions.updateSpec`, plus the `updateUrl` handling per content origin) only for OpenAPI. |
| `src/plugins/editor-content-type/selectors.js` | `selectIsContentTypeOpenAPI` matches `application/vnd.oai.openapi*`; JSON Schema content types are `application/schema+json\|yaml;version=<$schema URI>` (`selectIsContentTypeJSONSchema`, per dialect `selectIsContentTypeJSONSchema202012`). |
| `src/plugins/swagger-ui-adapter/extensions/core/wrap-components/BaseLayout.jsx` | Short-circuits AsyncAPI and API Design Systems; everything else renders Swagger UI's own `BaseLayout`. |

## Changes (PR 2)

1. **`EditorPreviewWrapper.jsx`**: render `EditorPreviewSwaggerUI` for OpenAPI and for every JSON
   Schema dialect Swagger UI renders natively. Use the dialect selectors
   (`selectIsContentTypeJSONSchema202012()`), not `selectIsContentTypeJSONSchema()`: a dialect the
   editor detects before Swagger UI supports it would otherwise get Swagger UI's "Unable to render
   this definition" instead of the editor's fallback. Declare the selectors in `propTypes`.
2. **`extensions/editor-content-type/wrap-actions.js`**: apply the OpenAPI branch (`updateUrl`
   handling, then `specActions.updateSpec(content, EditorContentOrigin.Editor)`) to the same
   dialects. Keep one condition shared by both files, e.g. a selector in
   `editor-preview-swagger-ui/selectors.js`, so they can't drift apart.
3. **swagger-ui-react**: bump it to the release with native standalone JSON Schema support (the
   gate below).
4. **Unchanged**:
   - `swagger-ui-adapter`'s `BaseLayout` wrap: JSON Schema falls through to Swagger UI's
     `BaseLayout`, which renders it. This also covers SwaggerUI-hosted previews (README "Using
     preview plugins in SwaggerUI").
   - `EditorPreviewSwaggerUI` and `previewUnmounted`.
   - `OnlineValidatorBadge` stays OpenAPI-only (validator.swagger.io validates OpenAPI only).
   - Download Resolved JSON/YAML comes with PR 3 (`SKILL.md` Step 4): it dereferences through
     apidom-ls, so it needs the ApiDOM release.

## Upstream Gate

`spec-status.mjs --json-schema <dialect> --swagger-ui-plugin JSONSchemaDocument
--swagger-ui-version <release>` passes when the installed `swagger-ui-react` bundle contains
`JSONSchemaDocument`, the registration key of Swagger UI's `json-schema-document` plugin, and the
installed version is at least `<release>`, the first swagger-ui release that renders this
dialect. Swagger UI's `/add-json-schema-support` gives both (decision 7 and its hand-off); record
them in the tracking doc. Every dialect shares the key, so only the release proves the dialect:
the key alone would let a Draft 7 gate pass on a release that renders only 2020-12. Without both
flags, or while the installed release falls short, the check reports `UPSTREAM`: routing would
show Swagger UI's "Unable to render this definition".

## Tests

In `test/playwright/e2e/plugin.editor-preview-swagger-ui.spec.ts`, the preview that now renders
the schema, a `test.describe` for JSON Schema with the existing helpers (`clickNestedMenuItem`,
`waitForContentPropagation`):

- Load Example "JSON Schema 2020-12" renders the schema in the Swagger UI preview: assert on what
  the native renderer shows (the schema's title or a property name), and that the fallback text
  "Unable to render editor content" is absent.
- Switching from JSON Schema to OpenAPI and back swaps the rendered document.
- OpenAPI 3.1/3.2 documents whose Schema Objects carry `$schema` still render as OpenAPI.
- A JSON document whose only `$schema` is nested isn't routed (detection, PR 1).
- An Arazzo document, or an OpenAPI version no adapter detects, with a root `$schema` of the
  dialect isn't routed (detection, PR 1: a root with `openapi`, `swagger`, `asyncapi` or
  `arazzo` is never JSON Schema).
