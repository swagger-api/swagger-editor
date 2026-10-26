# Claude Code Skills for SwaggerEditor

Skills for adding specification support to SwaggerEditor (swagger-editor@5): new OpenAPI
versions, standalone JSON Schema as described in the SwaggerHub design doc "Standalone JSON
Schema" (Confluence, SHUB space, page 4687691955), and other spec families ApiDOM supports
(AsyncAPI, A2A, Arazzo).

SwaggerEditor is the last link of a chain. Each skill checks the links before it and points to
the skill that builds a missing one:

| Order | Repository | Skill there | Provides to the editor |
|-------|------------|-------------|------------------------|
| 1 | `swagger-api/apidom` | `/add-spec-version` (namespace, parser adapters, apidom-reference, apidom-ls) | detection regexes, validation, completion, hover, semantic tokens |
| 2 | `swagger-api/swagger-client` | `/add-oas-support`, `/add-json-schema-support` | `openapi-X-Y-apidom` and `json-schema-<dialect>-apidom` resolve strategies for the preview |
| 3 | `swagger-api/swagger-ui` | `/add-oas-support`, `/add-json-schema-support` (`.claude/skills/` on `main`, swagger-api/swagger-ui#11106) | `isOAS3X` preview plugin, JSON Schema renderers |
| 4 | `swagger-api/swagger-editor` | the skills below | detection, routing, previews, examples, menus, themes, docs, tests |

Other spec families need only link 1: swagger-client and Swagger UI render OpenAPI and JSON
Schema, not AsyncAPI or A2A.

## Skill Layout

```
{skill}/
├── SKILL.md        # workflow, gates, hand-off (loaded on invocation)
├── references/     # templates and detail, read at the step that names them
├── scripts/        # deterministic checks (add-oas-support only; shared by all skills)
└── evals/          # skill-creator test cases: {case}/prompt.md, case.yaml, graders/, fixture.md
```

## Skills

### `/add-oas-support`

Adds an OpenAPI version line (3.3, 4.0, ...). Step 0 stops when an upstream release is missing.
Then: research and an uncommitted `ADD-OAS-{VERSION}.md`, dependency bump, wiring (detection,
selectors, fixture, Load Example, version-gated menus, themes, docs), preview check, Playwright
tests, gates, one PR. The OAS 3.2 commit `a7e7a960` (#5720) is the reference implementation.

### `/add-json-schema-support`

Delivers standalone JSON Schema, 2020-12 first: the SwaggerEditor part of the design doc's
complete plan, taking the ApiDOM part (adapters, apidom-ls) as done and Swagger UI's native
rendering as given. PR 1 ApiDOM bump, adapter dependencies and detection; PR 2 routing JSON Schema
content to the existing Swagger UI preview and the swagger-ui-react bump (no editor preview
plugin); PR 3 language features from apidom-ls and the highlighting check. Also covers further
dialects.

### `/add-spec-support`

Adds a spec family other than OpenAPI and JSON Schema (A2A, Arazzo) or a version line of one
(AsyncAPI 3.1, 4.0). Step 0 stops when ApiDOM or apidom-ls lacks the family. Then: family
profile (`references/families/`), preview decision (no-preview placeholder by default),
dependencies, detection (version-keyed, or structural through the adapter's `detect()`),
selectors, examples, family-enumerating menus, swagger-ui-adapter bypass, docs, tests.

### `/review-spec-support`

Read-only review of a branch made with any of the skills above, run in a fresh subagent that knows only the
target and the branch. Produces `REVIEW-{target}-{branch}.md` with severity, file:line, evidence
and fix per finding.

## Scripts

In `add-oas-support/scripts/`, run from the repository root:

| Script | Checks |
|--------|--------|
| `spec-status.mjs --oas X.Y [--parent X.Y]` / `--json-schema <dialect>` / `--spec <family> --version X.Y` | Upstream packages (`UPSTREAM`, exit 3), every editor integration point (`MISSING`, exit 1), version-gated consumers, files naming only the parent version, menus enumerating spec families, structural detection (`DECIDE`), Monaco theme coverage of apidom-ls token types (`NOTE`). Spec families are rows of `SPEC_FAMILIES`. `--root` for another checkout. |
| `check-detection.mjs [--oas X.Y.Z] [--json-schema <URI>] [--sample file=type]` | Runs the editor's real `detectContentType` over built-in samples (all supported specs, nested-`$schema` traps, documents with A2A-like keys) and checks that no two version selectors of a family match one content type. Other families pass their examples with `--sample`. |
| `verify-urls.mjs <paths>` / `--diff main` | HTTP status and `#anchor` of URLs (ported from ApiDOM via Swagger UI). |
| `test/smoke.sh` | Exit-code smoke test of the scripts; run after changing one. |

On `main` (2026-10-23) the scripts report real gaps; see `FOLLOW-UPS.md`.

## Evaluating Skills

Test cases use the skill-creator case-folder format, so `claude plugin eval` can run them too.
Each case's `fixture.md` says which commit to check out.

| Skill | Case | Fixture | Measures |
|-------|------|---------|----------|
| add-oas-support | `oas-3-2-wiring-plan` | `a7e7a960^` | regression: replays #5720 plus the gaps found after it |
| add-oas-support | `oas-3-3-upstream-gate` | `main` | generalization: a version no skill mentions; must stop at the upstream gate |
| add-json-schema-support | `json-schema-2020-12-plan` | `main` | regression: the design doc's editor part against today's code |
| add-json-schema-support | `json-schema-draft-07-plan` | `main` | partial generalization: a dialect the skill only tabulates |
| add-spec-support | `a2a-1-plan` | `main` | regression: the family profile's decisions for a family the editor lacks |
| add-spec-support | `asyncapi-3-1-replay` | `624a00e7^` | regression: replays #5909 (a minor line) plus the gaps found after it |
| add-spec-support | `arazzo-1-upstream-gate` | `main` | generalization: a family with ApiDOM adapters but no apidom-ls support; must stop |
| review-spec-support | `planted-defects-oas-3-2` | `a7e7a960` + `evals/planted-defects.patch` | 7 planted defects; 6 visible to the scripts, 1 only to reading |

Run them with skill-creator (one run with the skill and one without per case, read-only in the
fixture worktree, outputs outside the repository). They haven't been run yet
(`FOLLOW-UPS.md` section 3).

The regression cases share answers with the skills (the skills were written from the same
history), so they measure regressions more than ability. Keep the generalization cases honest:
don't copy their answers into the skills.

## Development Guidelines

Carried over from the ApiDOM skills (`swagger-api/apidom`, `.claude/skills/README.md`):

1. **Templates come from real files.** Name the file a template was copied from. This
   repository's CLAUDE.md had invented detection code and nonexistent selectors; skills must not.
2. **Never name a function, selector, script or file you haven't checked exists.**
3. **One rule, one place.** Repository conventions live in CLAUDE.md; wiring lessons in
   `add-oas-support/references/review-lessons.md`. Point to them instead of restating.
4. **Prefer a script over a prose check** when the check is mechanical, and keep
   `test/smoke.sh` passing.
5. **Questions need a fallback.** Skills may run as subagents that can't ask; each "ask the
   user" says what to assume and where to record it.
6. **Lessons go into rules, answers don't.** Add the general lesson from a review, not the answer
   for one version, or the generalization evals stop measuring anything.
7. **State-dependent facts carry a date** and the command that re-checks them.

New skills: `.claude/skills/{name}/SKILL.md` with `name` and a `description` that says when to
use it (including phrasings that don't name the skill), SKILL.md under 500 lines, details in
`references/`, at least one eval case.
