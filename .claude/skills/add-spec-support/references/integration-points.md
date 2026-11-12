# Integration Points for a Spec Family

Every file SwaggerEditor touches when it adds a spec family or a version line of one, in working
order. Each entry names the real code to copy; copy and rename, don't write from memory.
`spec-status.mjs --spec <family> --version X.Y` checks every entry marked (checked).

Names: `<family>` is the ApiDOM package id (`a2a`), `<Prefix>` the code prefix from
`SPEC_FAMILIES` (`A2A`), `<major>` the major version. Line numbers are from `main` on 2026-10-23.

## 1. package.json (checked)

As for OpenAPI (`../../add-oas-support/references/integration-points.md` section 1), with the
family's packages: `@swagger-api/apidom-parser-adapter-<family>-{json,yaml}-<major>` in
`dependencies` and `overrides`; those two plus `@swagger-api/apidom-ns-<family>-<major>` in
`link:apidom`. The namespace goes in `dependencies` only if `src` imports it
(`editor-preview-api-design-systems` imports `apidom-ns-api-design-systems` for its preview).

## 2. Content-Type Detection (checked)

`src/plugins/editor-content-type/actions.js`, `detectContentType`. Branches run in order and
the first match wins. Two shapes:

**Version-keyed** (the document names its version: `asyncapi: 3.1.0`, `arazzo: 1.0.1`). Copy
the AsyncAPI 2 pair (lines 65-81): `content.match(detectionRegExp...)` plus
`fn.isValidJSONObject` / `fn.isValidYAMLObject`; JSON reads `groups?.version_json`, YAML
`groups?.version_json ?? groups?.version_yaml`. Adapter regexes of different specs and lines are
exclusive, so place the pair next to the family's other lines.

**Structural** (no version field; the adapter's `detectionRegExp` has no `version_*` group and is
only a pre-filter, e.g. A2A). Copy the API Design Systems pair (lines 179-195): the regex match
**and** `await detect(content)` from the adapter. Two consequences:

- The version in the content type doesn't come from the document. Use the newest media type the
  adapter declares (`mediaTypes.latest('json')` / `('yaml')`, exported by the adapter) and record
  that in the tracking doc; `spec-status.mjs` reports it as `DECIDE detection`.
- Place the branches **after** every version-keyed branch and the JSON Schema `$schema` branches,
  directly before the generic `fn.isValidJSON` fallback (line 219): a structural match can hit an
  OpenAPI or JSON Schema document that merely contains the same keys. `check-detection.mjs` has
  built-in samples for that (`... with A2A-like keys`).

Content types use the namespace's media type with the format: `application/vnd.a2a+json;version=1.0.1`
(`node_modules/@swagger-api/apidom-ns-<family>-<major>/src/media-types.mjs`). Don't invent one.

Import `detectionRegExp` (and `detect` for structural families) from both adapters next to the
existing imports (lines 1-18; the API Design Systems imports show the `detect` form). A
hand-written regex is the exception for when an adapter exports none; the AsyncAPI 3 branches
(lines 101-121) are such a leftover, not a pattern (`FOLLOW-UPS.md` 1.6).

Then: `check-detection.mjs --sample <family>.json=<json type> --sample <family>.yaml=<yaml type>`.

## 3. Selectors (checked)

`src/plugins/editor-content-type/selectors.js`:

| Selector | Copy from | Notes |
|----------|-----------|-------|
| `selectIsContentType<Prefix>` | `selectIsContentTypeAsyncAPI` | `contentType.startsWith('<media type prefix>')`; new family only |
| `selectIsContentType<Prefix><major>` | `selectIsContentTypeAsyncAPI2` | when a second line exists or a consumer needs the version (`DECIDE detection`); escape the dots in its regex (`AsyncAPI2` has `/version=2.\d+\.\d+$/`, an unescaped `.`) |

Register each in `src/plugins/editor-content-type/index.js` (`statePlugins.editor.selectors`);
only registered selectors exist on `editorSelectors`.

`selectInferFileNameFromContent`: add the selector as an input and a branch returning the file
name from the family profile (`asyncapi3`, `a2a`, ...). The chain also misses AsyncAPI 3 and
JSON Schema today (`FOLLOW-UPS.md` 1.4); fix the neighbours you pass, and record the rest.

## 4. Example Fixture (checked)

- `src/plugins/editor-content-fixtures/selectors/select<Prefix>[<digits>]<Example><JSON|YAML>.js`:
  copy `selectAsyncAPI310PetstoreYAML.js` (a selector returning the document as a string). Use
  `versionedNames` from `SPEC_FAMILIES`: `selectAsyncAPI310PetstoreYAML`, but
  `selectA2AAgentCardJSON` for a family with one line. Prefer the format the spec's own examples
  use (A2A Agent Cards are JSON).
- The example uses the version's fields realistically and validates with 0 errors in the editor
  (apidom-ls lint rules run on it).
- Register it in `src/plugins/editor-content-fixtures/index.js`.

## 5. Load Example Menu (checked)

All under `src/plugins/top-bar/`; copy the AsyncAPI 3.1 lines of each file:

| File | Change |
|------|--------|
| `components/FileMenu/items/LoadExampleNestedMenu/items/<Prefix>[<digits>]<Example>MenuItem.jsx` | label `<Title> [X.Y] <Example>`; copy `AsyncAPI31PetstoreMenuItem.jsx` |
| `components/FileMenu/items/LoadExampleNestedMenu/LoadExampleNestedMenuHandler.jsx` | `load<Prefix>...Fixture()` and the fixture selector's PropTypes entry |
| `components/FileMenu/items/LoadExampleNestedMenu/LoadExampleNestedMenu.jsx` | `getComponent('TopBarFileMenuLoadExampleNestedMenu<...>MenuItem', true)`, a `useCallback` handler, and the item: a new family gets its own group after the last `<DropdownMenuItemDivider />` (lines 92-100: OpenAPI, AsyncAPI, JSON Schema, API Design Systems); a new line goes first in its family's group |
| `index.js` | import and register `TopBarFileMenuLoadExampleNestedMenu<...>MenuItem` |

Diff every new identifier against the copied one (#5720 shipped `loadOpenAP32PetstoreFixture`).

## 6. Consumers That Enumerate Families (`DECIDE consumers`)

Components that enable a feature for a list of families. `spec-status.mjs` lists files calling
two or more family selectors but not the new one. Today:

| File | Feature | Question |
|------|---------|----------|
| `top-bar/components/FileMenu/items/DownloadResolvedJSONMenuItem.jsx`, `...YAMLMenuItem.jsx` | Download Resolved (apidom-ls dereference in the worker) | does the family use `$ref`, and does apidom-ls dereference it? Try it in the running editor before enabling |
| `top-bar/components/GenerateServerMenu/*` | code generators (OpenAPI only) | normally not for other families; record it |
| `top-bar/components/EditMenu/items/ConvertToOpenAPI30xMenuItem.jsx` | Swagger 2.0 conversion | not applicable |

Format conversion (Convert to JSON/YAML, Convert and Save as) keys on the format selectors and
works for any detected family without changes. Record each answer in the tracking doc.

## 7. Preview Routing and swagger-ui-adapter (checked)

See `preview-decision.md`. Checked: an `extensions/editor-preview/wrap-components/` wrapper that
calls `selectIsContentType<Prefix>()`, and
`src/plugins/swagger-ui-adapter/extensions/core/wrap-components/BaseLayout.jsx` short-circuiting
the family (copy its AsyncAPI branch, add the selector to PropTypes).

## 8. Exports (checked when a new plugin exists)

A new `src/plugins/editor-preview-<family>/` plugin:

- `src/App.tsx`: import and add to `SwaggerEditor.plugins` (next to `EditorPreviewAsyncAPI`).
- `src/presets/monaco/index.js` and `src/presets/textarea/index.js`: import and add to the list.
- ESM entry points are discovered by `vite.config.esm.js` (`glob.sync('src/plugins/*/index.{js,ts}')`),
  so `swagger-editor/plugins/editor-preview-<family>` exists without config changes.
- `README.md`: every plugin list (`grep -n "editor-preview-asyncapi" README.md`), and CLAUDE.md's
  plugin count and "Preview plugins" list.

## 9. Monaco Themes (`NOTE theme`)

If apidom-ls has `src/config/<family>/tokens.mjs`, give each new token type an entry in
`src/plugins/editor-monaco/themes/se-vs-light.js` and `se-vs-dark.js` (colour of the closest
existing type), or record why the default is fine. No token list (A2A, 2026-10-23) means no
family-specific highlighting and nothing to map.

## 10. Docs (checked)

- `README.md`: the "Both modes support" list (`- AsyncAPI 2.x, 3.x`), plus plugin lists (8).
- `CLAUDE.md`: "Project Overview" spec list; plugin categories when a plugin is added.

## 11. Tests (checked: a Playwright spec names the family, and the version for versioned names)

See SKILL.md Step 5 and `../../add-oas-support/references/testing.md`.

## Not Needed

- `apidom.worker` / `ApiDOMWorker.js`: apidom-ls handles every family it is configured for, on
  any document; the editor's detection doesn't gate it.
- Format conversion menus: generic over JSON/YAML.
