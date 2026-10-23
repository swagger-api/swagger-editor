# Review Lessons

Defect classes found in earlier spec work: SwaggerEditor's own history (OAS 3.2 #5720,
AsyncAPI 3.1 #5909, dependency cleanup #5891), the Swagger UI OAS 3.2 reviews (#10721, #11090)
and the ApiDOM spec reviews (#5110, #5104, #5182). Each is written as a rule. When a review finds
a new class, add the general rule here, not the specific answer for one version: the evals rely
on the skills not containing answers.

## Wiring

1. **Upstream first.** The editor can't add what its packages lack. Wiring detection for a
   version that swagger-ui-react can't render produces "Unable to render this definition"; a
   missing swagger-client strategy silently drops `$ref` siblings in the preview (Swagger UI
   #11090). `spec-status.mjs` `UPSTREAM` lines stop the work.
2. **Every switch on concrete versions is an integration point.** Code that calls
   `selectIsContentTypeOpenAPI30x()`/`31x()` directly (generator menus, generator list fetching)
   didn't learn about 3.2 in #5720, and nothing records whether that was deliberate. Wire each
   one or write down why not.
3. **Chains that enumerate content types are integration points too.**
   `selectInferFileNameFromContent` knows OpenAPI 2.0-3.2 and AsyncAPI 2 but not AsyncAPI 3 or
   JSON Schema, so `Save as` proposes `definition.yaml` for them. When you extend a chain, check
   the other content types in it.
4. **Use the adapter's `detectionRegExp`.** Detection must agree with what apidom-ls parses; a
   hand-written regex (the AsyncAPI 3 branches in `actions.js`) can drift from the adapter's.
5. **Register what you export.** A selector defined in `selectors.js` but not listed in the
   plugin's `index.js` doesn't exist on `editorSelectors`; the failure appears only at runtime.
6. **No cross-plugin imports.** Reach other plugins through the system (`getComponent`,
   `editorSelectors`, wrap-actions). Reuse at runtime is fine; module imports couple builds of
   the ESM plugin exports (`swagger-editor/plugins/*`).
7. **Fix upstream bugs upstream.** A wrong dialect URL, missing resolve strategy or renderer gap
   belongs in swagger-ui, swagger-client or ApiDOM. Work around it in the editor only with the
   user's agreement and an issue link.

## Dependencies

8. **One apidom version.** All `@swagger-api/apidom-*` entries move together; mixed versions can
   install several copies of apidom-core, whose element classes then don't match across packages
   (check with `npm ls @swagger-api/apidom-core`: one version expected).
9. **Placement follows use (#5891).** Runtime imports (parser adapters for detection) go in
   `dependencies`; packages bundled into `apidom.worker` only (apidom-ls, namespaces) go in
   `devDependencies`. Each runtime adapter also needs an `overrides` entry.
10. **Scripts listing packages stay exact.** `link:apidom` lists `apidom-ns-openapi-3-2` twice
    since #5720; add each new package exactly once.

## Code

11. **Copy names, then check the spelling.** #5720 shipped `loadOpenAP32PetstoreFixture`. Diff
    each new identifier against the parent's.
12. **PropTypes describe what the component uses.** `EditorPreviewWrapper` (Swagger UI preview)
    declares `selectIsContentTypeOpenAPI31x`/`32x` but calls only `selectIsContentTypeOpenAPI`.
    Don't add new selectors to PropTypes of components that don't call them.
13. **Templates come from real files.** CLAUDE.md once showed detection as a regex on
    `^openapi:` returning `'openapi-3-1'` and cited selectors that don't exist
    (`selectEditorContentType`); code written from it would not have worked. Copy from the
    parent version's real files and name them in the PR description. Before citing a function,
    selector or file, grep for it.
14. **Version gating stays local.** A change for the new version must not alter older versions'
    behaviour; prove it with a parent-version regression test (Swagger UI #10721 leaked the
    `query` method into every version).

## Content and Tests

15. **The example shows the version.** The new fixture uses the version's new fields and
    validates with 0 errors in the editor; a copy of the parent's fixture with a new version
    number demonstrates nothing.
16. **A version without a test isn't supported.** On `main` after #5720 no Playwright spec
    mentions "OpenAPI 3.2". Load Example, preview and (when touched) generator behaviour each
    need a test.
17. **Docs move with code.** README supported-version lines and CLAUDE.md's overview are part of
    the change; stale docs are what the next agent reads.
