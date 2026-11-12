# {Title} ({family id})

Facts the editor needs, each with its source and the date it was checked. Re-check dated facts
before relying on them; update this file at hand-off.

## Specification

| Fact | Value | Source (checked {date}) |
|------|-------|-------------------------|
| Latest release | | spec repository tags/releases |
| How a document identifies itself | version field `...` / structural only | spec |
| Conventional file name | | spec |
| Usual format | JSON / YAML / both | spec examples |
| Fields new in this version (for the fixture) | | spec changelog |

## Upstream (installed packages)

| Fact | Value | Source (checked {date}) |
|------|-------|-------------------------|
| ApiDOM namespace and adapters | `@swagger-api/apidom-ns-{id}-{major}`, `...-parser-adapter-{id}-{json,yaml}-{major}` | `node_modules`, `npm view` |
| Media types | | `apidom-ns-*/src/media-types.mjs` |
| `detectionRegExp` shape | version groups / pre-filter only | adapter `src/adapter.mjs` |
| apidom-ls parses it | | `apidom-ls/src/parser-factory.mjs` |
| apidom-ls config (lint, completion, hover) | | `apidom-ls/src/config/{id}` |
| apidom-ls token types | | `apidom-ls/src/config/{id}/tokens.mjs` |
| Renderer for a preview | | npm, spec community |

## Editor Decisions

| Decision | Answer | Recorded in |
|----------|--------|-------------|
| Preview option (A/B/C) | | tracking doc |
| Content-type version for structural detection | | tracking doc |
| `Save as` file name | | tracking doc |
| Download Resolved | | tracking doc |
