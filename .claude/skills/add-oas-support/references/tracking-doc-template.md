# Tracking Document Template

Create `ADD-OAS-{VERSION}.md` (e.g. `ADD-OAS-3.3.md`) at the repository root. Keep it
uncommitted; it carries the work across sessions and is what `/review-spec-support` compares the
branch against.

```markdown
# Add OpenAPI {X.Y.Z} to SwaggerEditor

Spec: https://github.com/OAI/OpenAPI-Specification/blob/main/versions/{X.Y.Z}.md
Parent: {X.Y-1.Z}   Branch: feat/oas{XY}   Started: {YYYY-MM-DD}

## Upstream

| Package | Version | Provides | Status |
|---------|---------|----------|--------|
| @swagger-api/apidom-parser-adapter-openapi-{json,yaml}-{X-Y} | | detection regex | |
| @swagger-api/apidom-ls | | validation, completion, hover, tokens | |
| swagger-client (via swagger-ui-react) | | openapi-{X-Y}-apidom resolve strategy | |
| swagger-ui-react | | isOAS{XY} preview plugin | |

## Spec Changes Relevant to the Editor

| Change | Kind | Editor impact |
|--------|------|---------------|
| `openapi` field pattern | detection | adapter regex |
| {Object.field} | NEW | fixture uses it; token type? |
| {Object.field} | REMOVED | fixture must not use it |
| {new HTTP method / operation shape} | NEW | preview, generators |

## spec-status.mjs

Before: `{summary line}`   After: `{summary line}`

## Decisions (one row per DECIDE / NOTE line)

| Line | Decision | Reason |
|------|----------|--------|
| OpenAPI3GenerateServerMenu.jsx | parent-only | generator server rejects {X.Y} ({date}, response) |
| theme: {token} | mapped to colour {n} | same role as {existing token} |

## Gates

- [ ] lint  - [ ] test:run  - [ ] build  - [ ] pw:test (targeted)  - [ ] pw:test (full)
- [ ] spec-status 0 UPSTREAM / 0 MISSING  - [ ] verify-urls --diff main
- [ ] /review-spec-support findings fixed

## PR

{URL, state}
```
