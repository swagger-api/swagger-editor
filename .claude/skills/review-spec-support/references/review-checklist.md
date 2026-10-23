# Review Checklist

Each item says what to check and how to get evidence. Scripts live in
`.claude/skills/add-oas-support/scripts/`. "Parent" is the previous OpenAPI line, for JSON
Schema the 2020-12 code already on `main`, for another spec family its previous line (or, for a
new family, the neighbouring specs that must keep their behaviour).

## 1. Upstream and Dependencies

- [ ] `spec-status.mjs` shows 0 `UPSTREAM`. If not, every other finding is secondary: report it
      as a blocker first.
- [ ] All `@swagger-api/apidom-*` entries in `package.json` share one version (whatever the
      latest release is; don't expect a particular number);
      `npm ls @swagger-api/apidom-core` shows one version.
- [ ] Runtime imports (`grep -rhn "from '@swagger-api/" src | sort -u`) are in `dependencies`;
      packages only the ApiDOM worker uses are not added to `dependencies` (#5891).
- [ ] Each new adapter has an `overrides` entry; `link:apidom` lists new packages once.
- [ ] `package-lock.json` changed consistently with `package.json` (`npm ci` succeeds).

## 2. Detection

- [ ] `check-detection.mjs --oas X.Y.Z` / `--json-schema <URI>` / `--sample <file>=<type>`
      (spec families: the branch's own JSON and YAML fixtures): compare with the same run on
      `main` (`git stash` is not needed: `--root` a `main` worktree). New `MISMATCH` lines are
      blockers.
- [ ] Branches use the adapter's `detectionRegExp` when the adapter exports one.
- [ ] JSON and YAML branches both exist, JSON first, with `isValidJSONObject` /
      `isValidYAMLObject` guards, version from `version_json` / `version_json ?? version_yaml`.
- [ ] JSON Schema: root `$schema` only; spec documents with nested schemas keep their spec
      content type (the script's built-in samples cover this).
- [ ] Spec families with structural detection (no `version_*` group in the adapter regex, e.g.
      A2A): the branch also awaits the adapter's `detect()`, sits after the version-keyed and
      JSON Schema branches, and the tracking doc says which version the content type names.
      Content types use the namespace's media type (`apidom-ns-*/src/media-types.mjs`).

## 3. Selectors and Registration

- [ ] Every new selector is exported from `selectors.js` and registered in the plugin's
      `index.js`; every new action, component and wrap is registered in its plugin.
- [ ] Derived selectors use `createSelector`; regexes in selectors are anchored
      (`/version=3\.2\.\d+$/`).
- [ ] `selectInferFileNameFromContent` handles the new content type.

## 4. Consumers and Older Versions

- [ ] Each `DECIDE consumers` / `DECIDE unwired` line of `spec-status.mjs` is wired or has a
      reason in the tracking doc. Missing reason: major.
- [ ] No behaviour change for older versions: diff every edited branch that isn't new; a shared
      condition that was widened needs a test for the old version.
- [ ] Components don't gain PropTypes for selectors they don't call.

## 5. Examples

- [ ] The fixture parses and validates with 0 errors (load it in the running editor, or check
      the Playwright test that loads it), uses the version's new fields (compare with the spec's
      new/changed sections), and doesn't use removed ones.
- [ ] Menu item label follows the existing pattern (`OpenAPI X.Y Petstore`,
      `JSON Schema 2020-12`); names of new methods and components match the parent's pattern
      letter for letter.

## 6. Preview (JSON Schema, spec families, or any new preview)

- [ ] JSON Schema: no preview plugin and no `BaseLayout` bypass. `editor-preview-swagger-ui`'s
      `EditorPreviewWrapper` and `detectContentTypeSuccess` wrap-action route the dialect with
      its dialect selector (one shared condition), and the bumped swagger-ui-react renders it
      natively (`.claude/skills/add-json-schema-support/references/preview-routing.md`).
- [ ] `EditorPreview` wrap returns a new component and falls back to `<Original {...system} />`.
- [ ] Spec families: a detected document never shows `EditorPreviewFallback` ("Content was not
      recognized"); the preview option (placeholder, renderer, custom) matches the tracking doc
      (`.claude/skills/add-spec-support/references/preview-decision.md`).
- [ ] Spec families: `swagger-ui-adapter` `BaseLayout` bypass exists for the new content type.
- [ ] Render states: loading, parse failure, unsupported version, success.
- [ ] Reducers guard on `requestId`; `previewUnmounted` resets state.
- [ ] Styles are scoped partials imported via the plugin's `components/_all.scss` from
      `src/styles/main.scss`.

## 7. Validation and Highlighting

- [ ] Validation, completion, hover and semantic tokens come from apidom-ls; the branch adds no
      editor-side validator, completion provider or Monarch grammar for the spec.
- [ ] An invalid document shows a Validation Pane entry at the right position (load one in the
      running editor or check the Playwright test).
- [ ] Theme: new token types (`NOTE theme`) have entries in both `se-vs-light.js` and
      `se-vs-dark.js`, or a recorded reason.

## 8. Exports and Docs

- [ ] New plugins: `src/presets/monaco/index.js` and `src/presets/textarea/index.js`,
      `SwaggerEditor.plugins` in `src/App.tsx`, README plugin list and "Using preview plugins in
      SwaggerUI", CLAUDE.md plugin list.
- [ ] README and CLAUDE.md supported-version lists.
- [ ] `verify-urls.mjs --diff main`: 0 `BROKEN`; every `UNVERIFIED` looked at.

## 9. Tests

- [ ] Playwright covers: Load Example, preview of the new version/dialect, the parent still
      rendering as the parent, each `DECIDE` that changed behaviour (e.g. generator menus).
- [ ] Tests assert content (titles, version stamp, rendered property), not only visibility of a
      container.
- [ ] New test files are TypeScript; no `.only`; helpers from `test/playwright/helpers`.
- [ ] Run the changed specs: `npx playwright test <files>`; report failures with the first
      failing assertion.

## 10. Conventions

- [ ] CLAUDE.md: arrow-function components, `.js`/`.jsx` extensions on JS imports, JSX only in
      `.jsx`/`.tsx`, Immutable updates, no cross-plugin module imports.
- [ ] `npm run lint` clean on changed files (`npx eslint <files>`).
- [ ] Commit messages: Conventional Commits, header at most 69 characters (`.commitlintrc.json`).
- [ ] Each lesson in `.claude/skills/add-oas-support/references/review-lessons.md` that applies.
