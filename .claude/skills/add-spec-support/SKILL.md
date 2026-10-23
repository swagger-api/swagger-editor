---
name: add-spec-support
description: Adds support for a specification family other than OpenAPI and JSON Schema to SwaggerEditor - a new family such as A2A (Agent2Agent Agent Cards) or Arazzo, or a new version line of one the editor already knows such as AsyncAPI 3.1 or 4.0. Checks ApiDOM first (namespace, JSON/YAML parser adapters, apidom-ls parsing and config) and stops when a piece is missing, then wires dependencies, content-type detection (version-keyed or structural), family and version selectors, Load Example fixture and menu group, the preview decision (no-preview placeholder by default, or a preview plugin), the swagger-ui-adapter bypass, menus that enumerate spec families, theme tokens, exports, docs and Playwright tests, gated by `spec-status.mjs --spec` and a fresh-context `/review-spec-support`. Use whenever someone wants SwaggerEditor to recognise, validate, highlight, preview or offer examples for AsyncAPI, A2A, Arazzo or any other ApiDOM-supported spec, or asks why such a document shows "Content was not recognized as supported language", even if they don't name this skill. For OpenAPI versions use /add-oas-support; for standalone JSON Schema use /add-json-schema-support.
---

# Add Spec Family Support to SwaggerEditor

SwaggerEditor implements no specification itself. ApiDOM provides parsing and language
features; the editor detects the document, routes it and adds examples, menus and a preview:

| Capability | Comes from | Editor's part |
|------------|------------|---------------|
| Validation, completion, hover | `@swagger-api/apidom-ls` (`src/config/<family>`) in `apidom.worker` | dependency bump |
| Semantic highlighting | apidom-ls `src/config/<family>/tokens.mjs`, when present | Monaco theme entries |
| Content-type detection | ApiDOM parser adapters (`detectionRegExp`, `detect`) | imports, detection branch, selectors |
| Preview | a renderer, when one exists | placeholder or preview plugin, swagger-ui-adapter bypass |
| Examples, menus, file names | the editor | fixture, Load Example group, menu decisions, `Save as` name |

apidom-ls runs on every document regardless of the editor's detection, so once ApiDOM supports
a family, validation works without editor code; everything else in the table is this skill.

Reference implementations: AsyncAPI 3.0 (`1626243e`, #4886) for a new major line with a preview
plugin, AsyncAPI 3.1 (`624a00e7`, #5909) for a minor line, `editor-preview-api-design-systems`
for detection that calls the adapter's `detect()` and for a small custom preview.

**Not this skill:** OpenAPI versions (`/add-oas-support`: swagger-client and Swagger UI are
links of that chain) and standalone JSON Schema (`/add-json-schema-support`).

## Bundled Tools

The scripts live in `add-oas-support/scripts/` (shared by all spec skills). Run from the
repository root.

| Tool | Use |
|------|-----|
| `node .claude/skills/add-oas-support/scripts/spec-status.mjs --spec <family> --version X.Y` | Upstream (`UPSTREAM`, exit 3), every editor integration point (`MISSING`, exit 1), decisions (`DECIDE`): structural detection, version selector, menus that enumerate families. Families are rows of `SPEC_FAMILIES` at the top of the script; add one for a new family. |
| `node .claude/skills/add-oas-support/scripts/check-detection.mjs --sample <file>=<type>` | Runs the editor's real `detectContentType` over every supported spec plus your JSON and YAML examples. `MISMATCH` = wrong content type. |
| `node .claude/skills/add-oas-support/scripts/verify-urls.mjs <paths>` or `--diff main` | HTTP status and `#anchor` of URLs. |
| `references/integration-points.md` | Every file to touch, with the real file to copy. Read at Step 3. |
| `references/preview-decision.md` | Placeholder or preview plugin, and how each is built. Read at Step 1. |
| `references/families/<family>.md` | Dated facts per family (`asyncapi.md`, `a2a.md`); `_template.md` for a new one. |
| `references/tracking-doc-template.md` | The uncommitted `ADD-SPEC-{FAMILY}-{VERSION}.md`. |
| `../add-oas-support/references/review-lessons.md` | Defect classes from earlier spec work; all apply here. Read before Step 3. |
| `../add-oas-support/references/testing.md` | Playwright helpers and Vitest selector tests. Read at Step 5. |

## Step 0: Classify and Gate (every invocation)

1. Name the family (`a2a`, `asyncapi`, `arazzo`: the ApiDOM package id) and the version line.
   Pin the latest released version from the spec's own repository (tags, releases or schema
   files), not from memory, and record the URL.
2. Classify: **new family** (no `selectIsContentType<Family>` in
   `src/plugins/editor-content-type/selectors.js`), **new major line** of a known family, or
   **new minor line** (same detection regex, new fixture). A minor line skips most of Step 3;
   `spec-status.mjs` shows what's left.
3. If the family has no row in `SPEC_FAMILIES` (`spec-status.mjs`), add one (title, `prefix`
   used in code names, `versionedNames`), then run
   `spec-status.mjs --spec <family> --version X.Y`.
4. **`UPSTREAM` lines: is it published?** The script reads `node_modules`. Check the registry
   (`npm view @swagger-api/apidom-ls version`, `npm view @swagger-api/apidom-parser-adapter-<family>-json-<major> version`,
   and whether that apidom-ls release's `src/config/<family>` exists). If every piece is
   published, bump (Step 2) and re-run.
5. **Still `UPSTREAM`: stop.** Don't wire detection for a family apidom-ls can't validate. Report
   the missing pieces and where they are built: `/add-spec-version` in `swagger-api/apidom`
   (namespace, adapters, apidom-ls config and parser-factory). As a subagent without a user,
   stop with the report.

## Step 1: Research, Profile and Decisions

1. Read `references/families/<family>.md`; if it doesn't exist, copy `_template.md` and fill
   it from the spec and the installed packages (every fact with its source and date).
2. Collect what the editor needs: how a document identifies itself (a version field, or only its
   shape), the media types the ApiDOM namespace declares (`src/media-types.mjs`), the conventional
   file name, a realistic example document, which fields are new in this version (for the
   fixture), whether apidom-ls has token types and dereferencing for the family.
3. Create `ADD-SPEC-{FAMILY}-{VERSION}.md` at the repo root from
   `references/tracking-doc-template.md` (uncommitted); paste the `spec-status.mjs` output.
4. **Preview decision** (`references/preview-decision.md`): ask the user. Default when you can't
   ask: the no-preview placeholder, recorded in the tracking doc. A family that already has a
   preview keeps it; check that the renderer supports the new version.
5. **Checkpoint:** show the user the upstream versions, the preview decision and the open
   `DECIDE` lines; confirm before editing. As a subagent, record your assumptions and continue.

## Step 2: Dependencies

Same rules as OpenAPI (`../add-oas-support/SKILL.md` Step 2 and review lessons 8-10): all
`@swagger-api/apidom-*` at one version; the family's JSON and YAML parser adapters in
`dependencies` and `overrides` (detection imports them at runtime); namespace and adapters in
the `link:apidom` script once each; apidom-ls and namespaces stay out of `dependencies` unless
`src` imports them. `npm install`, commit `package-lock.json` with the change.

## Step 3: Wire the Editor

Read `../add-oas-support/references/review-lessons.md`, then work through
`references/integration-points.md` in its order: detection, selectors, `Save as` name, fixture,
Load Example group, family-enumerating consumers (`DECIDE consumers`), swagger-ui-adapter bypass,
themes, docs. Run `check-detection.mjs` with your JSON and YAML examples as `--sample` right
after the detection branch.

Keep changes inside the plugin that owns each file; plugins talk through the system
(`editorSelectors`, `getComponent`, wrap-actions), never by importing each other's modules.

## Step 4: Preview

Build what Step 1 decided (`references/preview-decision.md`): the placeholder, or the preview
plugin with its exports. Either way the preview pane must not say "Content was not recognized"
for a detected document, and a SwaggerUI-hosted preview must not say "Unable to render this
definition".

## Step 5: Tests

Follow `../add-oas-support/references/testing.md`, with these tests for a family:

- Load Example: each new menu item loads its fixture (first lines in the editor).
- Detection: JSON and YAML examples show the placeholder or the preview, not the fallback.
- A neighbouring spec still renders as before (an OpenAPI example keeps its Swagger UI preview):
  proves the new branch doesn't shadow older ones.
- Validation: an invalid field produces a marker (apidom-ls works end to end).
- `Save as` proposes the family's file name; menus decided in Step 3 show or hide as recorded.
- Vitest: a unit test for the new selectors when they do more than a `startsWith`.

## Step 6: Gates

- `npm run lint`, `npm run test:run`, `npm run build`, then targeted and full `npm run pw:test`.
- `spec-status.mjs --spec <family> --version X.Y`: 0 `UPSTREAM`, 0 `MISSING`, every `DECIDE`
  answered in the tracking doc.
- `check-detection.mjs --sample <json>=<type> --sample <yaml>=<type>`: all `OK` (a
  `MISMATCH` that also occurs on `main` goes in the tracking doc, not in this PR).
- `verify-urls.mjs --diff main`: 0 `BROKEN`.
- `/review-spec-support` in a fresh subagent that gets only "`<Family> X.Y`" and the branch.
  Fix every finding.

## Step 7: Pull Requests

A new family with a preview plugin is two PRs: (1) dependencies, detection, selectors, examples,
placeholder, docs, tests; (2) the preview plugin replacing the placeholder. A minor line or a
placeholder-only family is one PR, titled `feat: add support for <Family> X.Y.Z` (#5909 form).
Body: upstream versions, integration points, `DECIDE` answers, preview decision, tests. Pushing
and opening PRs are outward-facing: confirm with the user first. Commit messages follow CLAUDE.md.

## Hand-off

Report: upstream versions, `spec-status.mjs` summary before and after, preview decision,
`DECIDE` answers, test results, PR links. Update `references/families/<family>.md` with what you
learned (dated). Leave the tracking doc uncommitted.
