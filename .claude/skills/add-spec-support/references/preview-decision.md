# Preview Decision

A detected document without a preview falls through every `EditorPreview` wrapper to
`EditorPreviewFallback` (`src/plugins/editor-preview/components/EditorPreviewFallback.jsx`):
"Unable to render editor content. Content was not recognized as supported language in particular
format." That is wrong for a family the editor now recognises, so every family needs one of the
options below. In SwaggerUI-hosted mode (`swagger-ui-adapter`) the same document reaches Swagger
UI's `BaseLayout` and shows "Unable to render this definition" unless `BaseLayout.jsx` routes it.

| Option | When | Cost | Reference |
|--------|------|------|-----------|
| **A. No-preview placeholder** (default) | no renderer exists, or the preview is a later PR | one small plugin | below |
| B. Existing renderer library | the spec community maintains a React renderer | a plugin wrapping it, bundle size, maybe a worker | `editor-preview-asyncapi` (`@asyncapi/react-component`, parser in `worker/asyncapi-parser.worker.ts`) |
| C. Custom preview from ApiDOM elements | no renderer, and the document is small and regular | a plugin with components per object | `editor-preview-api-design-systems` |

Ask the user which option; record it in the tracking doc. As a subagent, take A and say so.
A family that already has a preview (AsyncAPI) keeps it: check that the renderer accepts the new
version (load the new example; for AsyncAPI, the `@asyncapi/parser` version in `package.json`)
and record the result.

## A. No-Preview Placeholder

A plugin `src/plugins/editor-preview-<family>/` that a later preview replaces in place, so
exports and routing don't change when the preview arrives:

```
editor-preview-<family>/
├── index.js                                   # components + wrapComponents only
├── components/EditorPreview<Prefix>.jsx       # the placeholder
├── components/_all.scss                       # only if it needs styles beyond the fallback's
└── extensions/editor-preview/wrap-components/EditorPreviewWrapper.jsx
```

- `EditorPreviewWrapper.jsx`: copy
  `editor-preview-asyncapi/extensions/editor-preview/wrap-components/EditorPreviewWrapper.jsx`,
  routing on `editorSelectors.selectIsContentType<Prefix>()` to
  `getComponent('EditorPreview<Prefix>', true)`.
- `EditorPreview<Prefix>.jsx`: reuse the fallback's markup and classes
  (`swagger-editor__editor-preview-fallback swagger-ui`, `version-pragma`) with a message that
  names the family and says there is no preview, e.g. "A2A Agent Card: no preview available.
  Validation and completion work in the editor." No new styles needed.
- `index.js`: `components: { EditorPreview<Prefix> }`,
  `wrapComponents: { EditorPreview: EditorPreviewWrapper }`. No state plugin: nothing is parsed.
- `swagger-ui-adapter/extensions/core/wrap-components/BaseLayout.jsx`: add the family branch
  (copy the AsyncAPI one) and the selector's PropTypes entry.
- Exports: `integration-points.md` section 8.
- Test: loading the family's example shows the placeholder text, and not "Content was not
  recognized".

## B and C. Preview Plugin

Copy the closer reference plugin's structure; both follow CLAUDE.md's FSM pattern:

| Piece | Reference (ADS) | Notes |
|-------|-----------------|-------|
| `actions.js` | `parse` thunk with `fn.generateRequestId()`, `parseStarted/Success/Failure`, `previewUnmounted` | ADS parses on the main thread with the adapter's `parse`; AsyncAPI parses in a worker (large documents) |
| `reducers.js`, `selectors.js` | request-ID guard, `selectIsParseInProgress/Success/Failure` | memoise derived selectors |
| `extensions/editor-content-type/wrap-actions.js` | `detectContentTypeSuccess` wrapped with `createSafeActionWrapper` (`util/fn.js`), parses when the family selector is true | |
| `extensions/editor-preview/wrap-components/EditorPreviewWrapper.jsx` | ADS wraps `EditorPreviewPane`, AsyncAPI wraps `EditorPreview` | either works; match the reference you copy |
| `components/` | `EditorPreview<Prefix>.jsx` (parsing / success / failure states, `previewUnmounted` on unmount), `ParseErrors.jsx`, one component per rendered object | register each in `components` |
| `index.js` | `statePlugins.editorPreview<Prefix>` with actions, selectors, reducers; `statePlugins.editor.wrapActions` | the state key becomes `editorPreview<Prefix>Actions/Selectors` |

A namespace import (`@swagger-api/apidom-ns-<family>-<major>`, for element predicates such as
`isAgentCardElement`) moves the namespace into `dependencies` (review lesson 9). A renderer
library goes in `dependencies`; check its licence and bundle size (`npm run build`, compare
`dist/` sizes) and record both. Styles: `components/_all.scss`, imported from
`src/styles/main.scss` like the other plugins'.

Ship B or C as its own PR after the placeholder PR (SKILL.md Step 7); it replaces the
placeholder component under the same `EditorPreview<Prefix>` name.
