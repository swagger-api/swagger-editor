# Integration Points for a New OpenAPI Version

Every file SwaggerEditor touches when it adds an OpenAPI version line, in working order. Each
entry names the real file to copy from: copy the parent version's code and rename, don't write
it from memory. `spec-status.mjs --oas X.Y` checks every entry marked (checked).

Names below use OpenAPI 3.2 as the example: `X.Y` = `3.2`, `XY` = `32`, `X-Y` = `3-2`,
`X_Y` = `3_2`, `XYZ` = `320`.

## 1. package.json (checked)

Reference: `git show a7e7a960 -- package.json`, then `git show 1dc43e6e -- package.json` for the
dependency placement that applies today.

| Where | What |
|-------|------|
| `dependencies` | `@swagger-api/apidom-parser-adapter-openapi-json-X-Y` and `-yaml-X-Y`, same version as every other `@swagger-api/apidom-*` entry; `swagger-ui-react` at the release with `isOASXY` |
| `devDependencies` | `@swagger-api/apidom-ls` bump (worker-only) |
| `overrides` | both adapters as `"$@swagger-api/apidom-parser-adapter-openapi-json-X-Y"`, next to the parent's entries |
| `scripts.link:apidom` | namespace and both adapters, once each |

Don't add `@swagger-api/apidom-ns-openapi-X-Y` to `dependencies` unless `src` imports it.

## 2. Content-type detection (checked)

`src/plugins/editor-content-type/actions.js`

- Import `detectionRegExp` from both adapters, after the parent's imports:
  `import { detectionRegExp as detectionRegExpOpenAPIJSON32x } from '@swagger-api/apidom-parser-adapter-openapi-json-3-2';`
- Add a JSON branch and a YAML branch after the parent's two branches, copied from them. The
  JSON branch reads `groups?.version_json`; the YAML branch reads
  `groups?.version_json ?? groups?.version_yaml` (YAML is a JSON superset). Content types:
  `application/vnd.oai.openapi+json;version=${version}` / `+yaml`.
- The adapter regexes are version-exclusive, so branch order between OpenAPI lines doesn't
  change the result; keep ascending order for readability. A hand-written regex (as for
  AsyncAPI 3 in this file) is the exception: only when the adapter doesn't export one.

## 3. Selectors (checked)

`src/plugins/editor-content-type/selectors.js`

- Copy `selectIsContentTypeOpenAPI31x` to `selectIsContentTypeOpenAPI32x`
  (`/version=3\.2\.\d+$/`).
- `selectInferFileNameFromContent`: add the selector as an input and the `openapi3_2` branch
  before the AsyncAPI branch.

`src/plugins/editor-content-type/index.js`: import and register the selector under
`statePlugins.editor.selectors`. Only registered selectors exist on `editorSelectors`.

## 4. Example fixture (checked)

- `src/plugins/editor-content-fixtures/selectors/selectOpenAPI{XYZ}PetstoreYAML.js`: copy the
  parent's fixture, set `openapi: X.Y.Z`, and use the version's new fields (from the tracking
  doc) so the example demonstrates them. Validate it in the running editor: 0 errors.
- `src/plugins/editor-content-fixtures/index.js`: import and register it.

## 5. Load Example menu (checked)

All under `src/plugins/top-bar/`:

| File | Change | Copy from |
|------|--------|-----------|
| `components/FileMenu/items/LoadExampleNestedMenu/items/OpenAPI{XY}PetstoreMenuItem.jsx` | new component, label `OpenAPI X.Y Petstore` | `OpenAPI31PetstoreMenuItem.jsx` |
| `components/FileMenu/items/LoadExampleNestedMenu/LoadExampleNestedMenuHandler.jsx` | `loadOpenAPI{XY}PetstoreFixture()` plus the selector's PropTypes entry | the parent's method |
| `components/FileMenu/items/LoadExampleNestedMenu/LoadExampleNestedMenu.jsx` | `getComponent('TopBarFileMenuLoadExampleNestedMenuOpenAPI{XY}PetstoreMenuItem', true)`, a `useCallback` handler, the item first in the OpenAPI group | the parent's lines |
| `index.js` | import and register `TopBarFileMenuLoadExampleNestedMenuOpenAPI{XY}PetstoreMenuItem` | the parent's lines |

Check spelling of every new name against the parent's (#5720 shipped
`loadOpenAP32PetstoreFixture`, missing an "I").

## 6. Version-gated consumers (`DECIDE`)

Files outside `editor-content-type` that call `selectIsContentTypeOpenAPI3?x()` directly decide
per version. Today:

| File | Behaviour | Question |
|------|-----------|----------|
| `top-bar/components/GenerateServerMenu/OpenAPI3GenerateServerMenu.jsx`, `OpenAPI3GenerateClientMenu.jsx` | show the generator menus | does the generator server accept the version? |
| `top-bar/extensions/editor-content-type/wrap-actions.js` | fetch the generator lists | same answer as above |
| `editor-preview-swagger-ui/extensions/editor-preview/wrap-components/EditorPreviewWrapper.jsx` | routes on `selectIsContentTypeOpenAPI()` (all versions) | PropTypes list selectors it doesn't call: don't add the new one there |

Re-run `spec-status.mjs`: the list above may have changed. Record each answer in the tracking doc.

## 7. Monaco themes (`NOTE theme`)

`src/plugins/editor-monaco/themes/se-vs-light.js` and `se-vs-dark.js`: a map from apidom-ls
semantic token type to colour index, plus `rules` for some types. apidom-ls lists its OpenAPI
token types in `node_modules/@swagger-api/apidom-ls/src/config/openapi/tokens.mjs`; compare the
list before and after the apidom bump (`git stash`, or the old version from npm) to find the new
version's types, and give each the colour of the closest existing type in both themes.

## 8. Docs (checked)

- `README.md`: the "Both modes support" list (Monaco syntax highlighting) and any other
  supported-versions line (`grep -n "OpenAPI 2.0" README.md`).
- `CLAUDE.md`: "Project Overview" version list.

## 9. Tests (checked: at least one Playwright spec names `OpenAPI X.Y`)

See `testing.md`.

## Not Needed for a 3.x Minor

- Preview routing: generic for all OpenAPI versions.
- `apidom.worker` / `ApiDOMWorker.js`: apidom-ls handles the version once it is bumped. The
  worker's `toolbelt` only exposes OpenAPI 2 and 3.0 namespaces for custom workers (#5579);
  extending it is a separate feature.
- `swagger-ui-adapter`: only AsyncAPI, API Design Systems (and a JSON Schema preview) bypass
  Swagger UI's `BaseLayout`.
