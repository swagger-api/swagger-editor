# A2A (a2a)

Agent2Agent protocol; the editor's document is the **Agent Card**. Checked 2026-10-23 against
`main` (apidom 1.13.3).

## Specification

| Fact | Value | Source |
|------|-------|--------|
| Latest release | v1.0.1 (2026-05-28) | `https://github.com/a2aproject/A2A/releases` |
| Specification | single page | `https://a2a-protocol.org/latest/specification/` |
| How a document identifies itself | structural only: no top-level version field. `protocolVersion` (major.minor, e.g. `"1.0"`, `"0.3"`) lives on each `supportedInterfaces[]` entry and describes that interface, not the card | specification, AgentInterface object |
| Conventional file name | `agent-card.json`, served at `/.well-known/agent-card.json` | specification, section 8.2 "Discovery Mechanisms" |
| Usual format | JSON | specification examples |

## Upstream (installed packages)

| Fact | Value | Source |
|------|-------|--------|
| ApiDOM namespace and adapters | `@swagger-api/apidom-ns-a2a-1`, `@swagger-api/apidom-parser-adapter-a2a-{json,yaml}-1`, 1.13.3, installed as apidom-ls dependencies (first published 2026-08-03) | `npm ls @swagger-api/apidom-ns-a2a-1`, `npm view ... time.created` |
| Media types | `application/vnd.a2a;version=1.0.{0,1}`, `+json`, `+yaml` (no IANA registration; ApiDOM's convention) | `apidom-ns-a2a-1/src/media-types.mjs` |
| `detectionRegExp` shape | pre-filter: matches `"capabilities": {` **or** `"skills": [` (YAML: either key at line start), no version group; `detect()` requires both and valid JSON/YAML | adapter `src/adapter.mjs` |
| apidom-ls parses it | yes, `a2a1AdapterJson`/`Yaml` in the parser factory | `apidom-ls/src/parser-factory.mjs` |
| apidom-ls config | `src/config/a2a/` (AgentCard, AgentSkill, AgentCapabilities, security schemes, OAuth flows, ...) | `apidom-ls/src/config/a2a` |
| apidom-ls token types | none: no `src/config/a2a/tokens.mjs`, not in `src/config/tokens.mjs` | apidom-ls |
| Renderer for a preview | none known | |

`spec-status.mjs --spec a2a --version 1.0` on `main`: 0 UPSTREAM, 19 MISSING, 6 DECIDE.

## Editor Decisions (defaults; confirm with the user)

| Decision | Default | Why |
|----------|---------|-----|
| Preview | A, no-preview placeholder | no renderer; chosen 2026-10-23 as the skill's default |
| Content-type version | the adapter's `mediaTypes.latest('json')` / `('yaml')`: `application/vnd.a2a+json;version=1.0.1` | the card carries no protocol version of its own |
| Detection placement | after the JSON Schema branches, before the generic fallback | structural; an OpenAPI or JSON Schema document can contain both keys |
| Selectors | `selectIsContentTypeA2A` only; no `selectIsContentTypeA2A1` until a second line exists | one line |
| Names | `versionedNames: false`: `selectA2AAgentCardJSON`, `A2AAgentCardMenuItem`, label "A2A Agent Card" | one line |
| `Save as` name | `agent-card` (`agent-card.json`) | the well-known file name |
| Download Resolved | off unless dereferencing an Agent Card proves useful; cards rarely use `$ref` | try it in the editor first |
| False positives | any JSON with both a `capabilities` object and a `skills` array is an A2A card; accept and record | adapter's documented behaviour |
