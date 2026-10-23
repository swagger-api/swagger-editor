---
name: add-oas-support
description: Adds support for a new OpenAPI Specification version (e.g. OpenAPI 3.3, a 3.2 patch line, 4.0) to SwaggerEditor, the last link of the chain ApiDOM, swagger-client, Swagger UI, SwaggerEditor. Checks the upstream releases first (ApiDOM namespace and parser adapters, apidom-ls, swagger-client resolve strategy, swagger-ui-react `isOAS3X`) and stops when one is missing, then wires dependencies, content-type detection, selectors, Load Example fixture and menu, version-gated menus (generators, conversion), Monaco theme tokens, docs and Playwright tests, gated by the bundled `spec-status.mjs` check and a fresh-context `/review-spec-support`. Use whenever someone wants SwaggerEditor (swagger-editor@5) to recognise, validate, preview or offer examples for an OpenAPI version, bumps ApiDOM/swagger-ui-react for a new OpenAPI release, or asks why a new OpenAPI version shows the wrong preview or no validation, even if they don't name this skill.
---

# Add OpenAPI Version Support to SwaggerEditor

SwaggerEditor doesn't implement OpenAPI itself. Each capability comes from an upstream package,
and the editor wires it in:

| Capability | Comes from | Editor's part |
|------------|------------|---------------|
| Validation, completion, hover, semantic tokens | `@swagger-api/apidom-ls` (in `apidom.worker`) | dependency bump, Monaco theme entries for new token types |
| Content-type detection | ApiDOM parser adapters' `detectionRegExp` | imports, detection branch, selectors |
| Preview | `swagger-ui-react` (`isOAS3X` plugin) + `swagger-client` resolve strategy | routing (generic for OpenAPI), version bump |
| Examples, menus, file names | the editor | fixture, Load Example item, generator/convert menus, `Save as` name |

So a version is supported only when every upstream release exists. The OAS 3.2 work
(`a7e7a960`, #5720) is the reference implementation; read its diff when a step below is unclear:
`git show a7e7a960 -- src package.json README.md`.

## Bundled Tools

Run from the repository root.

| Tool | Use |
|------|-----|
| `node .claude/skills/add-oas-support/scripts/spec-status.mjs --oas X.Y [--parent X.Y]` | Upstream prerequisites (`UPSTREAM`), every editor integration point (`OK` / `MISSING`), consumers that switch on concrete versions but not the new one (`DECIDE`), files naming the parent version but not the new one (`DECIDE unwired`), theme token coverage (`NOTE`). Exit 3 = upstream missing, 1 = editor wiring missing. |
| `node .claude/skills/add-oas-support/scripts/check-detection.mjs --oas X.Y.Z` | Runs the editor's real `detectContentType` over built-in samples (every supported spec, nested-`$schema` traps) plus JSON and YAML samples of the new version. `MISMATCH` = wrong content type; exit 1. |
| `node .claude/skills/add-oas-support/scripts/verify-urls.mjs <paths>` or `--diff main` | HTTP status and `#anchor` of every URL in the given files or the branch diff. |
| `bash .claude/skills/add-oas-support/scripts/test/smoke.sh` | Exit-code smoke test; run after changing a script. |
| `references/integration-points.md` | Every file to touch, with the real file and OAS 3.2 hunk to copy. Read at Step 3. |
| `references/tracking-doc-template.md` | The uncommitted `ADD-OAS-{VERSION}.md`. Read at Step 1. |
| `references/testing.md` | Playwright and Vitest patterns with the real helpers. Read at Step 5. |
| `references/review-lessons.md` | Defect classes from earlier spec work in this repo and its upstreams. Read before Step 3. |

## Step 0: Upstream Gate (every invocation)

1. Identify the version line (`3.2`), the latest released patch (`3.2.0`) and the parent line
   (`3.1`). Pin the patch from the spec repository's tags or `versions/` directory
   (`https://github.com/OAI/OpenAPI-Specification/tree/main/versions`), not from memory.
2. `npm ci` if `node_modules` is missing, then run
   `spec-status.mjs --oas X.Y --parent X.Y-1`.
3. **`UPSTREAM` lines: is it published?** The script reads `node_modules`, so first check the
   registry (`npm view @swagger-api/apidom-parser-adapter-openapi-json-X-Y version`,
   `npm view swagger-ui-react versions --json` plus that release's notes). If every missing
   piece is published, do the dependency bump (Step 2) first and re-run the script.
4. **Still `UPSTREAM`: stop.** Don't wire anything partially. Report which piece is missing
   and where it is built:
   - ApiDOM namespace, parser adapters, apidom-ls: `/add-spec-version` in `swagger-api/apidom`.
   - swagger-client resolve strategy (`src/resolver/strategies/openapi-X-Y-apidom`): a
     `swagger-api/swagger-js` release, then a swagger-ui release that depends on it.
   - swagger-ui-react `isOAS3X`: `swagger-api/swagger-ui` (its `/add-oas-support` skill, on
     `main` since swagger-api/swagger-ui#11106).

   As a subagent without a user, stop with the report; don't guess versions.
5. Major versions (4.0 "Moonwalk") don't share the 3.x document shape, so detection, preview
   routing and the swagger-ui plugin can't be copied from the 3.x line. Ask the user how to
   proceed; as a subagent, stop and report.

## Step 1: Research and Tracking Doc

The editor owns no OpenAPI fields, so this isn't ApiDOM's full field map. Collect only what the
editor needs:

1. Fetch the raw spec markdown of the pinned patch and of the parent
   (`https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/versions/{X.Y.Z}.md`) and
   the changes/"what's new" section.
2. Note: the version field and its format (detection), new objects and fields (they belong in
   the example fixture, and may bring new semantic token types), removed fields (the fixture must
   not use them), new HTTP methods or operation shapes (preview, generators).
3. Create `ADD-OAS-{VERSION}.md` at the repo root from `references/tracking-doc-template.md`
   (uncommitted). Paste the `spec-status.mjs` output into it.
4. **Checkpoint:** show the user the upstream versions you will bump to and the open `DECIDE`
   lines, and confirm before editing. As a subagent, record your assumption in the tracking doc
   and continue.

## Step 2: Dependencies

1. Bump every `@swagger-api/apidom-*` package to the same release, and `swagger-ui-react` to the
   release with `isOAS3X`. Mixed apidom versions put two copies of apidom-core in the bundle;
   `spec-status.mjs` flags them.
2. Add the new JSON and YAML parser adapters to `dependencies` (detection imports them at
   runtime), to `overrides` (`"$<package>"` form, alongside the others) and to the
   `link:apidom` script with the namespace. Packages used only by the pre-bundled
   `apidom.worker` (apidom-ls, namespaces) stay in `devDependencies` or out of `package.json`
   (#5891): don't add a namespace to `dependencies` unless `src` imports it.
3. `npm install`, commit `package-lock.json` with the change.

## Step 3: Wire the Editor

Read `references/review-lessons.md`, then work through `references/integration-points.md`,
in its order:

1. Detection branch in `editor-content-type/actions.js` (JSON then YAML, the adapter's
   `detectionRegExp` plus `fn.isValidJSONObject`/`isValidYAMLObject`). Run
   `check-detection.mjs --oas X.Y.Z` right after.
2. `selectIsContentTypeOpenAPI{XY}x` in `selectors.js`, registered in `index.js`, and used by
   `selectInferFileNameFromContent`.
3. Example fixture (`editor-content-fixtures/selectors/selectOpenAPI{XYZ}PetstoreYAML.js`) that
   exercises the version's new fields, registered; menu item, handler and `top-bar/index.js`
   registration; newest version first in the menu.
4. Every `DECIDE consumers` / `DECIDE unwired` line: wire it, or record in the tracking doc why
   it stays parent-only (e.g. the code generator server, `selectOpenAPI3GenerateServerURL` in
   `top-bar/selectors.js`, doesn't accept the version yet: ask the user, or POST the new example
   to it and record the response). An unrecorded `DECIDE` is a defect.
5. Monaco themes: new token types from apidom-ls for the new objects need entries in both
   `se-vs-light.js` and `se-vs-dark.js`, or a recorded reason to keep the default colour.
6. Docs: README supported-versions lines, CLAUDE.md project overview.

Keep changes inside the plugin that owns the file. Plugins talk through the system
(`editorSelectors`, `getComponent`, wrap-actions), never by importing each other's modules.

## Step 4: Preview Check

OpenAPI routing is generic (`selectIsContentTypeOpenAPI` in
`editor-preview-swagger-ui/.../EditorPreviewWrapper.jsx`), so a new version needs no routing code.
Start the dev server (`npm start`) or rely on the Playwright tests in Step 5, load the new
example and confirm the preview renders (no "Unable to render this definition"), `$ref`s resolve,
and validation markers appear for an invalid field. Fix upstream problems upstream; don't patch
swagger-ui behaviour in the editor.

## Step 5: Tests

Follow `references/testing.md`:

- Playwright: Load Example item loads the fixture (first lines), the Swagger UI preview renders
  it, a document of the new version is detected (preview shows its info), the parent version is
  still detected as the parent (regression), `Save as` proposes `openapi{X}_{Y}.yaml` if you
  touched file names.
- Vitest: selector unit tests when selector logic changed beyond a copy.

## Step 6: Gates

All must pass before the PR:

- `npm run lint`, `npm run test:run`, `npm run build`.
- `npm run pw:test -- test/playwright/e2e/<changed specs>` (dev server starts automatically),
  then the full `npm run pw:test` once.
- `spec-status.mjs --oas X.Y --parent X.Y-1`: 0 `UPSTREAM`, 0 `MISSING`, every `DECIDE` and
  theme `NOTE` answered in the tracking doc.
- `check-detection.mjs --oas X.Y.Z`: the new version's samples and every OpenAPI/AsyncAPI
  sample `OK` (a `MISMATCH` that also occurs on `main` goes in the tracking doc, not in this PR).
- `verify-urls.mjs --diff main`: 0 `BROKEN`.
- Run `/review-spec-support` in a fresh subagent that only gets "OpenAPI X.Y" and the branch
  name, so it reviews against the spec and the integration points rather than against what was
  just written. Fix every finding.

## Step 7: Pull Request

One PR, branch `feat/oas{XY}` (or the name the user gives), title
`feat: add support for OpenAPI X.Y.Z` (#5909 used this form for AsyncAPI 3.1.0). Body: upstream
versions bumped, integration points touched, `DECIDE` answers, tests. Pushing and opening the PR
are outward-facing: confirm with the user first. Commit messages follow CLAUDE.md (Conventional
Commits, max 69-character header).

## Hand-off

Report: upstream versions, `spec-status.mjs` summary line before and after, `DECIDE` answers,
test results, PR link. Leave `ADD-OAS-{VERSION}.md` uncommitted for the next session.
