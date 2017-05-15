import snippets from "./snippets"
import getSnippetsForPath from "./get-snippets-for-path"

export const getCompletions = (ori, sys) => (...args) => {
  ori(...args)
  // (ctx, editor, session, pos, prefix, cb)
  const [ctx, editor,, pos, prefix, cb] = args
  const { fn: { getPathForPosition } } = sys
  const { AST } = ctx
  const editorValue = editor.getValue()

  const path = getPathForPosition({ pos, prefix, editorValue, AST})
  return cb(null, getSnippetsForPath({ path, snippets}))
}
