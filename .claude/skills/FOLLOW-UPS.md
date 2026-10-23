# Follow-ups from Creating the Spec Support Skills (2026-10-23)

Found while writing and testing the skills. None were fixed in that session. Each item says how
to re-check it. Status legend: ⏳ open, ✅ done (add commit/PR reference).

## 1. Probable Bugs and Gaps on `main`

### 1.1 ⏳ JSON documents with a nested `$schema` are detected as JSON Schema 2020-12

- **Where:** `src/plugins/editor-content-type/actions.js`, the 2020-12 JSON branch: the regex
  matches `"$schema": "https://json-schema.org/draft/2020-12/schema"` anywhere in the document.
  The YAML branch only matches column 0 (root keys).
- **Effect:** `{"type": "object", "properties": {"a": {"$schema": "https://json-schema.org/draft/2020-12/schema"}}}`
  gets `application/schema+json;version=...` instead of `application/json`. The design doc
  requires the **root** `$schema`.
- **Check:** `node .claude/skills/add-oas-support/scripts/check-detection.mjs` (sample "JSON with
  nested $schema only" is `MISMATCH`).
- **Fix:** after the regex match, parse the JSON (it is parsed anyway by `isValidJSONObject`) and
  compare the root `$schema`. Belongs in PR 1 of `/add-json-schema-support`.
- **Commit:** `fix(editor-content-type): detect JSON Schema by root $schema only`

### 1.2 ⏳ No Playwright test mentions OpenAPI 3.2

- **Check:** `spec-status.mjs --oas 3.2` (`MISSING tests`).
- **Fix:** add "should display OpenAPI 3.2.0" to `plugin.editor-preview-swagger-ui.spec.ts` and
  "should load OpenAPI 3.2 Petstore example" to `plugin.top-bar.spec.ts`
  (`add-oas-support/references/testing.md`).
- **Commit:** `test: cover OpenAPI 3.2 example and preview`

### 1.3 ⏳ Generator menus ignore OpenAPI 3.2, without a recorded decision

- **Where:** `top-bar/components/GenerateServerMenu/OpenAPI3GenerateServerMenu.jsx`,
  `OpenAPI3GenerateClientMenu.jsx`, `top-bar/extensions/editor-content-type/wrap-actions.js`
  check only `selectIsContentTypeOpenAPI30x`/`31x`.
- **Check:** `spec-status.mjs --oas 3.2` (`DECIDE consumers`).
- **Fix:** ask whether `generator3.swagger.io` generates from 3.2 documents; widen the checks or
  add a code comment with the reason. Add a Playwright test either way.

### 1.4 ⏳ `Save as` file name for AsyncAPI 3 and JSON Schema is `definition`

- **Where:** `selectInferFileNameFromContent` in `editor-content-type/selectors.js` knows
  OpenAPI 2.0-3.2 and AsyncAPI 2 only.
- **Fix:** add `asyncapi3` and a JSON Schema name (e.g. `schema`); unit test the selector.

### 1.5 ⏳ Small OAS 3.2 leftovers

- `loadOpenAP32PetstoreFixture` (missing "I") in `LoadExampleNestedMenuHandler.jsx` and
  `LoadExampleNestedMenu.jsx`.
- `link:apidom` lists `@swagger-api/apidom-ns-openapi-3-2` twice.
- `editor-preview-swagger-ui/.../EditorPreviewWrapper.jsx` PropTypes declare
  `selectIsContentTypeOpenAPI31x`/`32x`, which the component doesn't call.
- **Commit:** `refactor: tidy OpenAPI 3.2 wiring leftovers`

### 1.6 ⏳ AsyncAPI 3 detection uses hand-written regexes

- **Where:** `editor-content-type/actions.js`, the two `asyncApi3*Match` branches. The AsyncAPI 3
  adapters exist (apidom-ls depends on them) and export `detectionRegExp`.
- **Fix:** add `@swagger-api/apidom-parser-adapter-asyncapi-{json,yaml}-3` as dependencies (with
  overrides) and use their regexes; `check-detection.mjs` must stay green. Out of these skills'
  scope (AsyncAPI); listed because the skills tell agents not to copy this pattern.

### 1.7 ⏳ Monaco themes have no entry for 8 apidom-ls OpenAPI token types

`parametersDefinitions`, `responsesDefinitions`, `httpMethod`, `items`, `headers`, `tag`, `xml`,
`scopes` (both themes). Possibly intentional (default colour, or `httpMethod` handled through
modifiers). Check with `spec-status.mjs --oas 3.2` (`NOTE theme`); decide and either map them or
document the default.

### 1.8 ⏳ Remaining CLAUDE.md inaccuracies

The content-type, styles-path and debugging sections were corrected with the skills. Still
wrong: several snippets use `useSystem()`, which doesn't exist in `src` (components receive the
system through props / `getComponent`); the header says version 5.0.6 (package is 5.10.0).

## 2. Cross-Repository Work Found

- **ApiDOM:** apidom-ls `parser-factory.ts` doesn't import the JSON Schema 2020-12 adapters, so
  standalone schemas aren't parsed as JSON Schema; its 2020-12 config covers 4 keywords. Needed
  for the full plan. Not yet in `apidom/.claude/skills/FOLLOW-UPS.md`.
- **Swagger UI:** the Swagger UI skills are paused (`swagger-ui/.claude/skills/HANDOFF.md`,
  branch `docs/claude-skills-oas-json-schema`). Their `/add-json-schema-support` is the upstream
  half of this repository's; keep the two consistent (dialect table, renderer choices, design
  doc digest). `verify-urls.mjs` here is a copy of theirs (formatted for this repo's prettier).

## 3. Eval Run (deferred: token-heavy)

Not run when the skills were written. Prepared:

- Case folders under each skill's `evals/` (5 cases, 36 graders), fixtures in each
  `fixture.md`.
- Worktrees in `~/WebstormProjects/swagger-editor-skills-workspace/` (outside the repo):
  `wt-pre-oas32` (`a7e7a960^`), `wt-oas32-planted` (branch `eval/oas32-planted-defects`, the
  patch applied and committed). Both have a `node_modules` symlink to the main checkout.

Cost: 5 cases x 2 configurations (with skill / without) = 10 agent runs, plus grading. Each run
explores the repository and writes a plan or report; the review case also runs Playwright only
if the agent chooses to.

Cheapest useful subset (4 runs): `oas-3-3-upstream-gate` and `json-schema-draft-07-plan`, with
and without the skill. They are the generalization cases.

How to run (skill-creator): one subagent per case and configuration, told to read the skill
files from the main checkout and not to use the Skill tool (it would load the current skills
into the baseline too), working read-only in the fixture worktree, writing `PLAN.md` /
`REVIEW-*.md` and an `actions.md` log (commands run, assumed answers) to
`swagger-editor-skills-workspace/iteration-1/<case>/{with_skill,without_skill}/outputs/`. Then
grade with skill-creator `agents/grader.md` (fields `text`/`passed`/`evidence`), aggregate with
`scripts/aggregate_benchmark`, and open `eval-viewer/generate_review.py`.

Description optimization (`scripts/run_loop`, `claude -p` x 3 per query per iteration) is
deferred for the same reason. Start with `add-oas-support` vs `add-json-schema-support`: both
mention detection and previews.

## 4. Session Leftovers

| Item | Location | Cleanup |
|------|----------|---------|
| Worktrees | `../swagger-editor-skills-workspace/wt-pre-oas32`, `wt-oas32-planted` | `git worktree remove --force <path>` after section 3 |
| Branch | `eval/oas32-planted-defects` | `git branch -D eval/oas32-planted-defects`; recreate from `a7e7a960` + the patch |
