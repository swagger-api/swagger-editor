# Add Standalone JSON Schema 2020-12 to SwaggerEditor

Dialect: 2020-12 (`$schema: https://json-schema.org/draft/2020-12/schema`)
Branch: `feat/json-schema-2020-12` (from `main` 7526c089)   Started: 2026-10-27
PRD step: E1 (PR 1). E2 (routing, PR 2) and E3 (language features, PR 3) stack on this branch.

## Upstream

| Package | Installed | Source | Provides | Status |
|---------|-----------|--------|----------|--------|
| every `@swagger-api/apidom-*` in `package.json` | 1.13.3 | npm (latest) | detection regexes, worker | released |
| `@swagger-api/apidom-parser-adapter-json-schema-{json,yaml}-2020-12` | 1.13.3 | npm | `detectionRegExp` (version group = dialect id `2020-12`) | released |
| `@swagger-api/apidom-ns-json-schema-2020-12` | 1.13.3 | tarball, apidom `feat/json-schema-2020-12/phase-3` at 11951862a | namespace used by the adapters, swagger-client | UNRELEASED |
| `@swagger-api/apidom-reference` | 1.13.3 | tarball, same branch and commit | `json-schema-2020-12` resolve/dereference strategies | UNRELEASED |
| `swagger-client` | 3.38.4 | tarball, swagger-client `feat/json-schema-2020-12` at b4815235 | `json-schema-2020-12-apidom` resolve strategy | UNRELEASED |
| `swagger-ui-react` | 5.34.0 | tarball, swagger-ui `feat/json-schema-2020-12-detection` at d486d082 (U1) | native rendering, plugin key `JSONSchemaDocument` | UNRELEASED |
| `@swagger-api/apidom-ls` | 1.13.3 | npm | language features: not for 2020-12 yet (E3 switches to apidom phase-4 tarballs) | MISSING (E3) |

Swagger UI key: `JSONSchemaDocument` (D7). First release that renders 2020-12: not out (expected
5.35.0); the gates pass the tarball's version, `--swagger-ui-version 5.34.0`.

Tarballs (in `../upstream-tarballs/`):

- `swagger-ui-react-5.34.0-d486d082.tgz` (packed here from the detached worktree
  `../swagger-ui-u1`; `npm ci && npm run build && flavors/swagger-ui-react/release/run.sh`)
- `swagger-client-3.38.4-b4815235.tgz`
- `swagger-api-apidom-ns-json-schema-2020-12-1.13.3-11951862a.tgz`
- `swagger-api-apidom-reference-1.13.3-11951862a.tgz`

Wiring: `swagger-ui-react` in `dependencies`; `swagger-client`, `apidom-ns-json-schema-2020-12`
and `apidom-reference` in `devDependencies` (the root listed none of them); a `$` override for
each of the four. One copy of each in `npm ls`; 43 × `apidom-core@1.13.3`, no other version.

## spec-status.mjs

`--json-schema 2020-12 --swagger-ui-plugin JSONSchemaDocument --swagger-ui-version <v>`

Before (`main`, swagger-ui-react 5.34.0 from npm, `<v>` = 5.34.0):
`1 UPSTREAM, 14 MISSING, 0 UNRELEASED, 1 DECIDE, 1 NOTE, 6 OK` (exit 3)

After (HEAD, tarballs, `<v>` = 5.34.0):
`0 UPSTREAM, 7 MISSING, 4 UNRELEASED, 0 DECIDE, 1 NOTE, 15 OK` (exit 1)

MISSING after PR 1, all for later PRs:

| Row | PR |
|-----|----|
| `language`: apidom-ls 1.13.3 doesn't parse JSON Schema 2020-12 (parser-factory) | E3 (apidom phase-4 tarballs) |
| `preview`: EditorPreviewWrapper shows the Swagger UI preview for OpenAPI only | E2 |
| `preview`: detectContentTypeSuccess passes only OpenAPI content to Swagger UI | E2 |
| `download`: Download Resolved JSON offered for OpenAPI and AsyncAPI only | E3 |
| `download`: Download Resolved YAML offered for OpenAPI and AsyncAPI only | E3 |
| `docs`: README doesn't state the supported JSON Schema dialects | E2 |
| `tests`: `plugin.editor-preview-swagger-ui.spec.ts` has no JSON Schema case | E2 |

The other `language` row (apidom-reference dereference strategy) is OK through the phase-3
apidom-reference tarball. NOTE: `link:apidom` lists `apidom-ns-openapi-3-2` twice (pre-existing,
FOLLOW-UPS 1.5, left alone). UNRELEASED: the four tarballs.

## Decisions

| ID | Decision | Editor impact |
|----|----------|---------------|
| D1 | Plan 1 (complete), no MVP | no ajv validation or Monarch grammar in the editor |
| D2 | Route JSON Schema to the existing Swagger UI preview, no editor plugin | E2 |
| D3 | References that cross dialects: out of scope | embedded resources get no special handling |
| D4 | Download Resolved through apidom-ls `doDeref`, as for OpenAPI | E3 |
| D5 | `$dynamicRef` left in place | nothing in the editor |
| D6 | Bundling deferred | nothing in the editor |
| D7 | Swagger UI plugin key `JSONSchemaDocument`; the gate takes the key and the first rendering release | gate flags above |
| D10 | Swagger UI refuses unrecognised root `$schema` values | E2 routes only detected dialects |
| D11 | Highlighting: the OpenAPI pattern, no theme change | E3 |
| D13 | Start on tarballs of ready upstream branches; merge after the releases, tarballs replaced, gates re-run; no npm prerelease | the tarball commit, draft PR |
| D18 | Standalone JSON Schema = root has the dialect's `$schema` AND none of `openapi`, `swagger`, `asyncapi`, `arazzo` (any value) | PR 1 detection (`fn.isJSONSchemaDocumentJSON`/`YAML`) |
| D25 | A root `$schema` of `https://json-schema.org/draft/2020-12/schema#` (empty fragment) IS 2020-12, everywhere (Core 2020-12 §8.2.1); ApiDOM phase-4 fixes its adapters' `detectionRegExp` and apidom-ls's root check | PR 1: `normalizeDialectIdentifier` in `fn.js` (as swagger-client); content type without `#`; the JSON and quoted-YAML `#` cases need the repacked adapters |
| D14-D17, D19-D24 | upstream internals | none for E1 |
| A4 | apidom-ls: namespace `json-schema`, version `2020-12`, media types `application/schema+{json,yaml};version=2020-12` | the editor keeps `version=<$schema URI>` |

Recorded in `.claude/skills/add-json-schema-support/references/design-and-delivery.md` (decision
5 and "Answered with the delivery plan").

## Assumptions (Step 1.3 checkpoint, recorded as a subagent)

1. ApiDOM bump: a no-op. Every `@swagger-api/apidom-*` dependency is already `^1.13.3` and
   installs 1.13.3, the latest release; the two adapters are added at the same version.
2. D18 checks the presence of an own root key (also `null` or object values), as Swagger UI
   (`spec.has(field)`) and apidom-ls (root-member regex, commit 35a252c85 on phase-4) do.
3. Superseded by D25 (2026-10-27): an empty fragment is normalised on both sides (document
   value and dialect URI, so the draft-04/06/07 URIs, which end in `#`, work the same way);
   other fragments, a trailing slash and `http://` are refused. `main` detected every YAML `#`
   form through its loose regex; the first E1 commits refused them; D25 restores them.
4. File name `schema` for every JSON Schema dialect (`selectIsContentTypeJSONSchema`); AsyncAPI 3
   stays `definition` (no `selectIsContentTypeAsyncAPI3`; FOLLOW-UPS 1.4/1.6).
5. `link:apidom` gains the namespace and both adapters; its duplicate `apidom-ns-openapi-3-2`
   stays (FOLLOW-UPS 1.5, an OAS 3.2 tidy-up).
6. Vitest tests are `.test.js`: `tsconfig.json` includes `src/**/*.ts`, so a `.test.ts` would be
   type-checked and emitted into `dist/types` by `build:definitions`.
7. The preview-spec regression tests avoid the words "JSON Schema", so `spec-status.mjs`'s
   `tests` row (a `/JSON Schema/` grep of that spec) stays MISSING until E2 adds the Load
   Example rendering test.
8. Playwright 1.58.2 needs `chromium_headless_shell-1208`, which wasn't in
   `~/Library/Caches/ms-playwright`; installed into `node_modules/playwright-core/.local-browsers`
   (`PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install --only-shell chromium`), so every
   Playwright run here uses `PLAYWRIGHT_BROWSERS_PATH=0`.

## PR Split

| PR | Step | Content |
|----|------|---------|
| 1 (this branch) | E1 | adapter dependencies (ApiDOM already 1.13.3), root-only and D18 detection, `schema` file name, tests, skill docs (D18), upstream tarballs |
| 2 | E2 | `EditorPreviewWrapper` + `detectContentTypeSuccess` routing on the dialect selector, README dialects, Load Example rendering test |
| 3 | E3 | apidom phase-4 tarballs (apidom-ls), language features check, highlighting check, Download Resolved JSON/YAML |

## Keyword Map: JSON Schema 2020-12

Sources: https://json-schema.org/draft/2020-12/schema and
https://json-schema.org/draft/2020-12/meta/{core,applicator,unevaluated,validation,meta-data,format-annotation,content}
(fetched 2026-10-27)   swagger-ui-react 5.34.0 (tarball d486d082)   ApiDOM 1.13.3

Renderer: `grep -o "JSONSchema202012Keyword[A-Za-z$]*"` over the installed
`swagger-ui-es-bundle-core.js`; constraints from `stringifyConstraints` in U1's
`json-schema-2020-12/fn.js`.

| Vocabulary | Keyword | Renderer | Fixture | Scope | Notes |
|------------|---------|----------|---------|-------|-------|
| core | $id | JSONSchema202012Keyword$id | yes | in | |
| core | $schema | JSONSchema202012Keyword$schema | yes | in | detection key (root only, D18) |
| core | $ref | JSONSchema202012Keyword$ref | yes | in | resolved by swagger-client's strategy in the preview |
| core | $anchor | JSONSchema202012Keyword$anchor | | in | |
| core | $dynamicRef | JSONSchema202012Keyword$dynamicRef | | in | left in place (D5) |
| core | $dynamicAnchor | JSONSchema202012Keyword$dynamicAnchor | | in | |
| core | $vocabulary | JSONSchema202012Keyword$vocabulary | | in | |
| core | $comment | JSONSchema202012Keyword$comment | | in | |
| core | $defs | JSONSchema202012Keyword$defs | yes | in | |
| applicator | prefixItems | JSONSchema202012KeywordPrefixItems | | in | |
| applicator | items | JSONSchema202012KeywordItems | yes | in | |
| applicator | contains | JSONSchema202012KeywordContains | | in | |
| applicator | additionalProperties | JSONSchema202012KeywordAdditionalProperties | | in | |
| applicator | properties | JSONSchema202012KeywordProperties | yes | in | |
| applicator | patternProperties | JSONSchema202012KeywordPatternProperties | | in | |
| applicator | dependentSchemas | JSONSchema202012KeywordDependentSchemas | | in | |
| applicator | propertyNames | JSONSchema202012KeywordPropertyNames | | in | |
| applicator | if | JSONSchema202012KeywordIf | yes | in | |
| applicator | then | JSONSchema202012KeywordThen | yes | in | |
| applicator | else | JSONSchema202012KeywordElse | | in | |
| applicator | allOf | JSONSchema202012KeywordAllOf | | in | |
| applicator | anyOf | JSONSchema202012KeywordAnyOf | | in | |
| applicator | oneOf | JSONSchema202012KeywordOneOf | | in | |
| applicator | not | JSONSchema202012KeywordNot | | in | |
| unevaluated | unevaluatedItems | JSONSchema202012KeywordUnevaluatedItems | | in | |
| unevaluated | unevaluatedProperties | JSONSchema202012KeywordUnevaluatedProperties | | in | |
| validation | type | JSONSchema202012KeywordType | yes | in | |
| validation | const | JSONSchema202012KeywordConst | yes | in | |
| validation | enum | JSONSchema202012KeywordEnum | yes | in | |
| validation | multipleOf | constraint | | in | |
| validation | maximum | constraint | | in | |
| validation | exclusiveMaximum | constraint | | in | |
| validation | minimum | constraint | | in | |
| validation | exclusiveMinimum | constraint | | in | |
| validation | maxLength | constraint | | in | |
| validation | minLength | constraint | | in | |
| validation | pattern | constraint | | in | |
| validation | maxItems | constraint | | in | |
| validation | minItems | constraint | yes | in | |
| validation | uniqueItems | constraint | | in | |
| validation | maxContains | constraint | | in | |
| validation | minContains | constraint | | in | |
| validation | maxProperties | constraint | | in | |
| validation | minProperties | constraint | | in | |
| validation | required | JSONSchema202012KeywordProperties (required marker) | yes | in | no component of its own |
| validation | dependentRequired | JSONSchema202012KeywordDependentRequired | yes | in | |
| meta-data | title | JSONSchema202012KeywordTitle | yes | in | |
| meta-data | description | JSONSchema202012KeywordDescription | yes | in | |
| meta-data | default | JSONSchema202012KeywordDefault | | in | |
| meta-data | deprecated | JSONSchema202012KeywordDeprecated | | in | |
| meta-data | readOnly | JSONSchema202012KeywordReadOnly | | in | |
| meta-data | writeOnly | JSONSchema202012KeywordWriteOnly | | in | |
| meta-data | examples | JSONSchema202012KeywordExamples | yes | in | |
| format-annotation | format | constraint | yes | in | also in the type label for int32/int64/float/double |
| content | contentEncoding | constraint | | in | |
| content | contentMediaType | constraint | | in | |
| content | contentSchema | JSONSchema202012KeywordContentSchema | | in | |
| (compat) | definitions | extension | | out | deprecated, declared by the dialect meta-schema for compatibility |
| (compat) | dependencies | extension | | out | same |
| (compat) | $recursiveAnchor | extension | | out | same (2019-09) |
| (compat) | $recursiveRef | extension | | out | same (2019-09) |

Summary: 61 keywords (57 in the seven vocabularies, 4 compat). 38 rendered by a dedicated
component, 1 (`required`) by `KeywordProperties`, 18 constraint only, 4 in the extension
catch-all (hidden unless `showExtensions`), 0 unrendered. Validation, completion and hover come
from apidom-ls for all of them (E3). Out of scope: the 4 compat keywords.

Not keywords of the dialect, in the fixture (`selectJSONSchema202012YAML.js`, on `main`): `xml`
(an OpenAPI Schema Object keyword; the bundle's `KeywordXml` comes from Swagger UI's OpenAPI
plugins) and `version` (falls into extension keywords). The fixture also lacks prefixItems,
unevaluated*, contentSchema and the numeric constraints. For E2 to look at with the rendering.

## Observations for the Orchestrator

1. **Trailing `#` on the identifier**: answered by D25 (accepted everywhere).
2. Two existing tests flaked once each under parallel load and passed on rerun: `Editor Preview
   Pane: JumpToPath for Schemas` (OpenAPI 3.0; a targeted run, then 3/3 alone and in every
   later run) and `Editor Preview Pane: AsyncAPI 3.x › displays expandable message payload`
   (the first full run, then 3/3 alone and in the second full run). Not this change.

## Review of fdbc274b (2026-10-27) and Follow-up

| # | Finding | Done |
|---|---------|------|
| 1 | (major) drop the tarball commit | overruled by the orchestrator (D13, local branches); kept, repacked in step B |
| 2 | (major) `#` form refused (D25) | `normalizeDialectIdentifier` in `fn.js`; unit tests (JSON, YAML unquoted/single/double-quoted; refused: other fragments, `##`, `schema/`, `http://`, D18 roots with `#`); `check-detection.mjs` samples; skill docs |
| 3 | (minor) examples/default/const with an `openapi`/`swagger` string detected as OpenAPI (on `main` too) | FOLLOW-UPS 1.10 with reproductions (also `asyncapi`, and YAML flow style); no code change |
| 4 | (minor) "one unit test" in CLAUDE.md and testing.md | both updated |
| 5 | (minor) describe title without 3.2.x | renamed |
| 6 | (question) `.test.ts` | kept `.js`: strict plugin TS7016 needs `@ts-strict-ignore`, and `build:definitions` would publish `*.test.d.ts`; FOLLOW-UPS 1.11 |

Until the ApiDOM phase-4 repack (step B), three unit tests (`#` in JSON, single- and
double-quoted YAML) and two `check-detection.mjs` samples fail: the installed 1.13.3 adapter
regexes don't accept the `#`.

## Gates (HEAD with tarballs, before the review follow-up)

- [x] `npm run lint`: exit 0
- [x] `npm run test:run`: 3 files, 46 tests passed
- [x] `npm run build`: exit 0 (app, ESM, UMD, definitions)
- [x] `npx playwright test` targeted (preview-swagger-ui, top-bar): 49 passed
- [x] `npm run pw:test` full: 71 passed, 1 skipped (`test.skip` in `plugin.dropzone.spec.ts`,
      on `main`); the first full run had 1 flake (Observations 2)
- [x] `spec-status.mjs`: 0 UPSTREAM, 7 MISSING (all E2/E3), 4 UNRELEASED
- [x] `check-detection.mjs --json-schema https://json-schema.org/draft/2020-12/schema`: 23 OK, 0 MISMATCH
- [x] `verify-urls.mjs --diff main`: 7 URLs, 0 broken
- [ ] `/review-spec-support` (fresh subagent, run by the orchestrator)

## PR

Not opened (draft until the upstream releases); title and body in the E1 report.
