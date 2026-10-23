---
name: review-spec-support
description: Reviews a SwaggerEditor branch or PR that adds OpenAPI version support, standalone JSON Schema support or another spec family (AsyncAPI, A2A, Arazzo), from a fresh context, against the official specification, the upstream packages actually installed and the editor's integration points - detection exclusivity and order, selector registration, version-gated consumers, dependency placement, Load Example wiring, preview routing and the swagger-ui-adapter bypass, validation markers, theme tokens, docs and Playwright coverage - and produces a findings report with file:line evidence and spec citations. Use after /add-oas-support, /add-json-schema-support or /add-spec-support, or whenever someone asks to review, audit or double-check spec-support changes in swagger-editor ("review my OAS 3.3 branch", "check the JSON Schema preview PR", "review the A2A branch"), even if they don't name this skill.
---

# Review Spec Support Changes in SwaggerEditor

The author of a change reviews what they meant to write; this skill reviews what the branch
does. Run it in a **fresh subagent** that gets only:

- the target: `OpenAPI X.Y`, `JSON Schema <dialect>` or `<Family> X.Y` (`A2A 1.0`),
- the branch or PR number,
- optionally the tracking doc path (`ADD-OAS-X.Y.md` / `ADD-JSON-SCHEMA-<dialect>.md` /
  `ADD-SPEC-<FAMILY>-X.Y.md`) for the author's recorded decisions.

Don't give it the author's summary or conclusions. It is read-only: it reports, it doesn't fix.

## Inputs and Setup

1. Check out the branch (`gh pr checkout <n>` or `git switch <branch>`); don't modify files.
   `npm ci` if `node_modules` is stale relative to `package-lock.json` (needed for the status
   script's upstream checks).
2. `git diff --stat main...HEAD` and the full diff of `src`, `test`, `package.json`, `README.md`,
   `CLAUDE.md`.
3. Status: `node .claude/skills/add-oas-support/scripts/spec-status.mjs --oas X.Y --parent X.Y-1`
   or `--json-schema <dialect>` or `--spec <family> --version X.Y`;
   `node .claude/skills/add-oas-support/scripts/verify-urls.mjs --diff main`.
4. The spec: OpenAPI raw markdown of the pinned patch
   (`https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/versions/{X.Y.Z}.md`) and the
   parent; for JSON Schema the meta-schemas in
   `.claude/skills/add-json-schema-support/references/dialects.md`; for other families the
   release named in `.claude/skills/add-spec-support/references/families/<family>.md`.

## Checks

Work through `references/review-checklist.md`. Its sections:

1. Upstream and dependencies (versions consistent, placement, overrides, lock file).
2. Detection (adapter regex, JSON/YAML pairs, exclusivity against neighbours, root-only
   `$schema`, order relative to OpenAPI/AsyncAPI/ADS).
3. Selectors and registration.
4. Consumers: every `DECIDE` from the status script either wired or justified in the tracking
   doc; no behaviour change for older versions.
5. Examples: fixture valid for the version and demonstrating its new features; menu wiring and
   names.
6. Preview: routing, swagger-ui-adapter bypass, render states, HOC creation cost, styles.
7. Validation and highlighting: marker provider lifecycle, positions, duplicates with apidom-ls,
   theme tokens.
8. Exports and docs.
9. Tests: what is covered, what isn't, regression for the parent version.
10. Code conventions from CLAUDE.md and `.claude/skills/add-oas-support/references/review-lessons.md`.

Prove claims by running code where cheap: e.g. evaluate the detection regexes against a document
of the new version, of the parent version and of a neighbouring spec with `node -e` (the
checklist has a snippet). A finding without evidence is a question, so label it as one.

## Report

Write `REVIEW-<target>-<branch>.md` (uncommitted) and return it as your final message:

```markdown
# Review: {target} on {branch} ({short sha})

spec-status: {summary line}   verify-urls: {n BROKEN, n UNVERIFIED}

## Findings

| # | Severity | Area | File:line | Finding | Evidence | Fix |
|---|----------|------|-----------|---------|----------|-----|
| 1 | blocker | detection | src/plugins/editor-content-type/actions.js:162 | ... | command + output, or spec quote with URL#anchor | ... |

## Not Checked
{what you couldn't verify and why}
```

Severities: **blocker** (wrong behaviour for users, a spec violation, a broken build or test,
an older version changed), **major** (missing integration point, missing test for a new
behaviour, undocumented `DECIDE`), **minor** (naming, PropTypes, docs wording), **question**
(no evidence either way). Order by severity. No praise, no summary of what is fine beyond the
status line.
