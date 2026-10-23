# The `editor-preview-json-schema` Plugin

Build it from this repository's preview plugins. Each section names the file to copy; read it
before writing the new one.

| Concern | Copy from |
|---------|-----------|
| Plugin shape, state plugin, parse FSM | `src/plugins/editor-preview-api-design-systems/` (`index.js`, `actions.js`, `reducers.js`, `selectors.js`) - parses with ApiDOM adapters like this plugin will |
| `EditorPreview` wrap | `src/plugins/editor-preview-asyncapi/extensions/editor-preview/wrap-components/EditorPreviewWrapper.jsx` |
| Parse on detection | `src/plugins/editor-preview-asyncapi/extensions/editor-content-type/wrap-actions.js` (`createSafeActionWrapper`) |
| Preview lifecycle (`previewUnmounted`) | `src/plugins/editor-preview-swagger-ui/components/EditorPreviewSwaggerUI/EditorPreviewSwaggerUI.jsx` |
| SwaggerUI-hosted rendering | `src/plugins/swagger-ui-adapter/extensions/core/wrap-components/BaseLayout.jsx` |

## Layout

```
src/plugins/editor-preview-json-schema/
├── index.js                     # components, wrapComponents, statePlugins, afterLoad
├── actions.js                   # previewUnmounted, parse, parseStarted/Success/Failure
├── reducers.js                  # parse status, result, error; requestId guard
├── selectors.js                 # selectParseStatus, selectIsParse*, selectParseResult, selectSchema, ...
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

Parse with the dialect's ApiDOM JSON Schema adapter; its `parse` returns a parse result whose
`result` is already the dialect's JSON Schema element (for 2020-12 `JSONSchemaElement`, element
name `JSONSchema202012`), the same shape the ADS preview gets from its adapters:

```javascript
import { parse as parseJSON } from '@swagger-api/apidom-parser-adapter-json-schema-json-2020-12';
import { parse as parseYAML } from '@swagger-api/apidom-parser-adapter-json-schema-yaml-2020-12';

const parser = contentType.includes('+json') ? parseJSON : parseYAML;
const parseResult = await parser(content, { sourceMap: true });
const schemaElement = parseResult.result;
```

Check the installed adapter's exports before writing the import
(`node_modules/@swagger-api/apidom-parser-adapter-json-schema-json-<dialect>/src/adapter.mjs`).

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

## Language Features (PR 3)

Validation markers, completion, hover and semantic tokens come from apidom-ls in the ApiDOM
worker (`editor-monaco-language-apidom`), exactly as for OpenAPI; the preview plugin adds none.
After the ApiDOM bump, check them in the running editor and give the JSON Schema token types
entries in `src/plugins/editor-monaco/themes/se-vs-light.js` and `se-vs-dark.js`. A missing
diagnostic, completion item or hover text is an ApiDOM issue, not an editor workaround.
