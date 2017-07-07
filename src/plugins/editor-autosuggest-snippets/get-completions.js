import snippets from "./snippets"
import getSnippetsForPath from "./get-snippets-for-path"

export default function getCompletions(editor, session, pos, prefix, cb, ctx, system) {

  const { fn: { getPathForPosition }, specSelectors } = system
  const { isOAS3 } = specSelectors

  if(isOAS3 && isOAS3()) {
    // isOAS3 selector exists, and returns true
    return cb(null, null)
  }

  const { AST } = ctx
  const editorValue = editor.getValue()
  const path = getPathForPosition({ pos, prefix, editorValue, AST})

  const suggestions = getSnippetsForPath({ path, snippets})

  return cb(null, suggestions)
}
