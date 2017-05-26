import snippets from "./snippets"
import getSnippetsForPath from "./get-snippets-for-path"

export default function getCompletions(editor, session, pos, prefix, cb, ctx, system) {

  const { fn: { getPathForPosition } } = system
  const { AST } = ctx
  const editorValue = editor.getValue()
  const path = getPathForPosition({ pos, prefix, editorValue, AST})

  const suggestions = getSnippetsForPath({ path, snippets})
  cb(null, suggestions)
}
