# The `editor-preview-json-schema` Plugin

Build it from this repository's preview plugins. Each section names the file to copy; read it
before writing the new one.

| Concern | Copy from |
|---------|-----------|
| Plugin shape, state plugin, parse FSM | `src/plugins/editor-preview-api-design-systems/` (`index.js`, `actions.js`, `reducers.js`, `selectors.js`) - parses with ApiDOM adapters like this plugin will |
| `EditorPreview` wrap | `src/plugins/editor-preview-asyncapi/extensions/editor-preview/wrap-components/EditorPreviewWrapper.jsx` |
| Parse on detection | `src/plugins/editor-preview-asyncapi/extensions/editor-content-type/wrap-actions.js` (`createSafeActionWrapper`) |
| Marker provider (validation) | `src/plugins/editor-preview-asyncapi/monaco.contribution.js` and `after-load.js` |
| Preview lifecycle (`previewUnmounted`) | `src/plugins/editor-preview-swagger-ui/components/EditorPreviewSwaggerUI/EditorPreviewSwaggerUI.jsx` |
| SwaggerUI-hosted rendering | `src/plugins/swagger-ui-adapter/extensions/core/wrap-components/BaseLayout.jsx` |

## Layout

```
src/plugins/editor-preview-json-schema/
├── index.js                     # components, wrapComponents, statePlugins, afterLoad
├── actions.js                   # previewUnmounted, parse, parseStarted/Success/Failure
├── reducers.js                  # parse status, result, error; requestId guard
├── selectors.js                 # selectParseStatus, selectIsParse*, selectParseResult, selectSchema, ...
├── after-load.js                # registers the marker provider when Monaco is present (PR 3)
├── monaco.contribution.js       # marker provider (PR 3)
├── components/
│   ├── EditorPreviewJSONSchema/EditorPreviewJSONSchema.jsx   # switches on parse status and dialect
│   ├── ParseErrors/ParseErrors.jsx
│   └── _all.scss                # imports the component partials; imported by src/styles/main.scss
└── extensions/
    ├── editor-preview/wrap-components/EditorPreviewWrapper.jsx
    └── editor-content-type/wrap-actions.js
```

State key `editorPreviewJSONSchema` (so `system.editorPreviewJSONSchemaActions` /
`...Selectors`). Component names prefixed `EditorPreviewJSONSchema`. New files may be
`.tsx`/`.ts` (CLAUDE.md: gradual TypeScript); keep `.jsx` only where you copy JSX files whose
siblings are `.jsx` and the plugin's style stays consistent.

## Parsing

Parse with the generic adapters the editor already depends on, then refract with the dialect's
namespace (verified with apidom 1.13.3):

```javascript
import { parse as parseJSON } from '@swagger-api/apidom-parser-adapter-json';
import { parse as parseYAML } from '@swagger-api/apidom-parser-adapter-yaml-1-2';
import { JSONSchemaElement } from '@swagger-api/apidom-ns-json-schema-2020-12';

const parser = contentType.includes('+json') ? parseJSON : parseYAML;
const parseResult = await parser(content, { sourceMap: true });
const schemaElement = JSONSchemaElement.refract(parseResult.result); // element 'JSONSchema202012'
```

Declare `@swagger-api/apidom-ns-json-schema-2020-12` in `dependencies` (runtime import) at the
same version as the other apidom packages, with an `overrides` entry. Once apidom-ls parses
standalone JSON Schema (full plan), the dialect's parser adapters
(`apidom-parser-adapter-json-schema-{json,yaml}-2020-12`) can replace parse + refract.

`sourceMap: true` keeps element positions, which the marker provider needs to place markers.
The renderer needs plain JSON: `toValue(schemaElement)` from `@swagger-api/apidom-core`, memoised
in a selector (`createSelector`) so the renderer doesn't re-render on every unrelated state
change.

Guard every success/failure reducer with the `requestId` of the latest `parseStarted` (see
CLAUDE.md "Request ID Race Conditions"): typing fires detection and parsing on each change.

## Routing

`EditorPreviewWrapper`: when `editorSelectors.selectIsContentTypeJSONSchema()`, render
`getComponent('EditorPreviewJSONSchema', true)`; otherwise `<Original {...system} />`. Return a
new component; never return `Original` itself.

`EditorPreviewJSONSchema` switches on:

1. parse in progress: loading state (copy the BaseLayout loading markup);
2. parse failure: `EditorPreviewJSONSchemaParseErrors`;
3. a dialect this plugin renders: the dialect component (2020-12 below);
4. anything else (a `$schema` the plugin doesn't render yet): an "unsupported dialect" message,
   not a blank pane.

## Rendering 2020-12

```javascript
const JSONSchema202012 = getComponent('JSONSchema202012');
const withJSONSchema202012SystemContext = getComponent('withJSONSchema202012SystemContext');
```

`withJSONSchema202012SystemContext(Component, { config, fn, components })` creates the context
the renderer needs outside an OpenAPI document (`makeWithJSONSchemaSystemContext` in Swagger UI's
`src/core/plugins/json-schema-2020-12/hoc.jsx`; `config.showExtensionKeywords` defaults to the
Swagger UI `showExtensions` option, off by default). Creating the HOC is expensive: create it once
(module-level cache or `useMemo` with stable inputs), not on every render. Useful `config`:
`defaultExpandedLevels` (0 by default); `showExtensionKeywords: true` so keywords the renderer
doesn't know (see `design-and-delivery.md`) are visible rather than silently hidden. Record both
choices.

The OpenAPI 3.1 plugin overrides some `fn.jsonSchema202012` functions globally
(`isExpandable`, `getProperties`); test rendering with a schema using `properties`,
`patternProperties`, `$defs`, `allOf` and `prefixItems`.

Add the preview's styles as partials (`_editor-preview-json-schema.scss`, copy
`editor-preview-asyncapi/components/EditorPreviewAsyncAPI/_editor-preview-async-api.scss`),
listed in the plugin's `components/_all.scss` and imported by `src/styles/main.scss` next to the
other preview plugins. Scope them under a plugin class
(`.swagger-editor__editor-preview-json-schema`).

## SwaggerUI-Hosted Previews

`swagger-ui-adapter`'s `BaseLayout` wrap already short-circuits AsyncAPI and API Design Systems.
Add JSON Schema the same way (`selectIsContentTypeJSONSchema()` and the component exists), so the
preview plugin works when a Swagger UI instance loads it (README "Using preview plugins in
SwaggerUI"). Extend the PropTypes there with the selector you call.

## Exports and Docs

- `src/presets/monaco/index.js`: add the plugin after the other preview plugins.
- `src/App.tsx`: `SwaggerEditor.plugins.EditorPreviewJSONSchema` next to `EditorPreviewAsyncAPI`.
- `vite.config.esm.js` builds every `src/plugins/*/index.{js,ts}` as an export
  (`swagger-editor/plugins/editor-preview-json-schema`) automatically; check
  `dist/esm/plugins/editor-preview-json-schema/index.js` after `npm run build`.
- README: plugin list, "Using preview plugins in SwaggerUI" examples, supported dialects.

## Validation (PR 3)

MVP with ajv, registered like the AsyncAPI parser markers:

- `after-load.js`: when `system.monaco` exists, (re)create the disposables from
  `monaco.contribution.js` and keep them on the state plugin (copy the AsyncAPI `after-load.js`).
- `fn.registerMarkerDataProvider('apidom', { owner: 'editor-preview-json-schema', provideMarkerData })`:
  wait with `fn.waitUntil` until the content type is a JSON Schema dialect, the model value equals
  the editor content and parsing is done; return `[]` when the model version moved on or parsing
  failed (the ApiDOM worker already reports syntax errors).
- Validate the parsed value with the dialect's ajv class against its meta-schema
  (`ajv.validateSchema`), `allErrors: true`, `strict: false`. Map each error's `instancePath`
  (JSON Pointer) to a range with the source map of the parsed element (find the element by
  pointer with `@swagger-api/apidom-json-pointer`'s `evaluate`, already a dependency, then read
  its start/end position); fall back to the document start only if the pointer doesn't resolve.
- Severity Error, `source`/`owner` that makes the marker distinguishable from apidom-ls in the
  Validation Pane.

Full plan: once apidom-ls validates the dialect, remove the ajv provider (or gate it off) so the
same problem isn't reported twice.
