# Tracking Document Template

Create `ADD-SPEC-{FAMILY}-{VERSION}.md` (e.g. `ADD-SPEC-A2A-1.0.md`) at the repository root.
Keep it uncommitted; it carries the work across sessions and is what `/review-spec-support`
compares the branch against.

```markdown
# Add {Title} {X.Y.Z} to SwaggerEditor

Spec: {URL of the pinned release}   Kind: new family / new major line / new minor line
Branch: feat/{family}{XY}   Started: {YYYY-MM-DD}   Profile: references/families/{family}.md

## Upstream

| Package | Version | Provides | Status |
|---------|---------|----------|--------|
| @swagger-api/apidom-ns-{family}-{major} | | namespace, media types | |
| @swagger-api/apidom-parser-adapter-{family}-{json,yaml}-{major} | | detectionRegExp, detect, parse | |
| @swagger-api/apidom-ls (parser-factory, src/config/{family}) | | validation, completion, hover | |
| apidom-ls src/config/{family}/tokens.mjs | | semantic tokens | present / absent |
| {renderer, if option B} | | preview | |

## Document Identification

{version field and its pattern, or structural markers; content type the editor will produce;
where the detection branches go and why}

## Preview Decision

Option {A/B/C}: {reason; who decided, or "assumed as subagent"}

## spec-status.mjs

Before: `{summary line}`   After: `{summary line}`

## Decisions (one row per DECIDE / NOTE line)

| Line | Decision | Reason |
|------|----------|--------|
| detection: no version group | content type names {version} | {why} |
| no selectIsContentType{Prefix}{major} | family selector only | one version line |
| DownloadResolvedJSONMenuItem.jsx | not enabled | {tried in editor: ...} |

## Gates

- [ ] lint  - [ ] test:run  - [ ] build  - [ ] pw:test (targeted)  - [ ] pw:test (full)
- [ ] spec-status 0 UPSTREAM / 0 MISSING  - [ ] check-detection with --sample  - [ ] verify-urls --diff main
- [ ] /review-spec-support findings fixed

## PRs

{URLs, state}
```
