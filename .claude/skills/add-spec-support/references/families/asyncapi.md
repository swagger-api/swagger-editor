# AsyncAPI (asyncapi)

Checked 2026-10-23 against `main` (apidom 1.13.3, `@asyncapi/react-component` 3.1.1,
`@asyncapi/parser` 3.6.0).

## Specification

| Fact | Value | Source |
|------|-------|--------|
| Lines supported by the editor | 2.x, 3.x (examples: 2.6.0, 3.1.0) | README "Both modes support"; `editor-content-fixtures` |
| How a document identifies itself | `asyncapi: X.Y.Z` | spec |
| Releases | `https://github.com/asyncapi/spec/releases` | |

## Upstream (installed packages)

| Fact | Value | Source |
|------|-------|--------|
| ApiDOM | `apidom-ns-asyncapi-{2,3}`, adapters `asyncapi-{json,yaml}-{2,3}`; the 3 adapters' regex accepts any `3.x.y` | `node_modules` |
| apidom-ls | parses 2 and 3; config `src/config/asyncapi`; token list `src/config/asyncapi/tokens.mjs` (`identifier` unmapped in both themes) | apidom-ls |
| Preview | `editor-preview-asyncapi`: `@asyncapi/react-component`, parsing in `worker/asyncapi-parser.worker.ts` | plugin |

## Editor State

| Integration point | State | Reference |
|-------------------|-------|-----------|
| Detection 2.x | adapter regexes, first branches of `detectContentType` | `actions.js` lines 65-81 |
| Detection 3.x | **hand-written** regexes; the 3 adapters are not dependencies | `actions.js` lines 101-121, `FOLLOW-UPS.md` 1.6 |
| Selectors | `selectIsContentTypeAsyncAPI`, `selectIsContentTypeAsyncAPI2`; no `...AsyncAPI3` | `selectors.js` |
| `Save as` | `asyncapi2` only; 3.x gets `definition` | `FOLLOW-UPS.md` 1.4 |
| Examples | 2.6 and 3.1 Petstore and Streetlights | #5909 |
| Tests | Playwright covers AsyncAPI 2.6 only | `spec-status.mjs --spec asyncapi --version 3.1` |

A new 3.x minor (3.2) is a minor line: fixture, menu items, tests, README; detection already
accepts it. A 4.0 line needs adapters, detection, a version selector and a renderer check.
